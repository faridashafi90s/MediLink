using MediLink.Application.DTOs;
using MediLink.Application.Interfaces;
using MediLink.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MediLink.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<Doctor> _doctorHasher;
        private readonly PasswordHasher<Patient> _patientHasher;

        public AuthService(
            IDoctorRepository doctorRepository,
            IPatientRepository patientRepository,
            IConfiguration configuration)
        {
            _doctorRepository = doctorRepository;
            _patientRepository = patientRepository;
            _configuration = configuration;
            _doctorHasher = new PasswordHasher<Doctor>();
            _patientHasher = new PasswordHasher<Patient>();
        }

        public async Task<bool> RegisterUser(RegisterDto request)
        {
            if (request.Role == UserRole.Doctor && request.Doctor == null)
                throw new ArgumentException("Doctor data required");

            if (request.Role == UserRole.Patient && request.Patient == null)
                throw new ArgumentException("Patient data required");

            var (email, password) = request.Role switch
            {
                UserRole.Doctor => (request.Doctor!.Email, request.Password),
                UserRole.Patient => (request.Patient!.Email, request.Password),
                _ => throw new ArgumentException("Invalid role")
            };

            if (await _doctorRepository.Exists(email) || await _patientRepository.Exists(email))
                throw new InvalidOperationException("Email already registered");

            if (request.Role == UserRole.Doctor)
            {
                var doctor = new Doctor
                {
                    Email = email,
                    FirstName = request.Doctor!.FirstName,
                    LastName = request.Doctor.LastName,
                    Specialization = request.Doctor.Specialization,
                    ContactNumber = request.Doctor.ContactNumber
                };
                doctor.Password = _doctorHasher.HashPassword(doctor, password);
                await _doctorRepository.AddAsync(doctor);
            }
            else
            {
                var patient = new Patient
                {
                    Email = email,
                    FirstName = request.Patient!.FirstName,
                    LastName = request.Patient.LastName,
                    DateOfBirth = request.Patient.DateOfBirth,
                    Gender = request.Patient.Gender,
                    ContactNumber = request.Patient.ContactNumber
                };
                patient.Password = _patientHasher.HashPassword(patient, password);
                await _patientRepository.AddAsync(patient);
            }

            return true;
        }

        public async Task<AuthResponseDto?> LoginUser(LoginDto request)
        {
            if (request.Role == UserRole.Doctor)
            {
                var doctor = await _doctorRepository.GetByEmail(request.Email);
                if (doctor != null && VerifyDoctorPassword(doctor, request.Password))
                    return GenerateToken(doctor, UserRole.Doctor);
            }
            else
            {
                var patient = await _patientRepository.GetByEmail(request.Email);
                if (patient != null && VerifyPatientPassword(patient, request.Password))
                    return GenerateToken(patient, UserRole.Patient);
            }
            return null;
        }

        private bool VerifyDoctorPassword(Doctor doctor, string password)
            => _doctorHasher.VerifyHashedPassword(doctor, doctor.Password, password)
                == PasswordVerificationResult.Success;

        private bool VerifyPatientPassword(Patient patient, string password)
            => _patientHasher.VerifyHashedPassword(patient, patient.Password, password)
                == PasswordVerificationResult.Success;

        private AuthResponseDto GenerateToken(dynamic user, UserRole role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, role.ToString()),
                new("fullName", $"{user.FirstName} {user.LastName}")
            };

            var token = tokenHandler.CreateToken(new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            });

            return new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                Email = user.Email,
                Role = role.ToString(),
                UserId = user.Id,
                FullName = $"{user.FirstName} {user.LastName}"
            };
        }
    }
}