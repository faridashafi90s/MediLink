using AutoMapper;
using MediLink.Application.DTOs;
using MediLink.Application.Interfaces;
using MediLink.Application.Mappers;
using MediLink.Application.Mappings;
using MediLink.Domain.Entities;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IDoctorRepository _doctorRepository;
    private readonly IMapper _mapper;

    public AppointmentService(IAppointmentRepository appointmentRepository, IPatientRepository patientRepository, IDoctorRepository doctorRepository, IMapper mapper)
    {
        _appointmentRepository = appointmentRepository;
        _patientRepository = patientRepository;
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
    {
        var appointments = await _appointmentRepository.GetAllAsync();

        var patientIds = appointments.Select(a => a.PatientId).Distinct().ToList();
        var doctorIds = appointments.Select(a => a.DoctorId).Distinct().ToList();

        var patients = await _patientRepository.GetByIdsAsync(patientIds);
        var doctors = await _doctorRepository.GetByIdsAsync(doctorIds);

        var patientDictionary = patients.ToDictionary(p => p.Id, p => $"{p.FirstName} {p.LastName}");
        var doctorDictionary = doctors.ToDictionary(d => d.Id, d => $"{d.FirstName} {d.LastName}");

        return AppointmentMapper.ToDtoList(appointments, patientDictionary, doctorDictionary);
    }

    public async Task<AppointmentDto> GetByIdAsync(int id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        return _mapper.Map<AppointmentDto>(appointment);
    }

    public async Task<AppointmentDto> CreateAsync(AppointmentDto appointmentDto)
    {
        var appointment = _mapper.Map<Appointment>(appointmentDto);
        await _appointmentRepository.AddAsync(appointment);
        return _mapper.Map<AppointmentDto>(appointment);
    }

    public async Task<AppointmentDto> UpdateAsync(int id, AppointmentDto appointmentDto)
    {
        var existingAppointment = await _appointmentRepository.GetByIdAsync(id);
        if (existingAppointment == null) throw new KeyNotFoundException("Appointment not found.");

        _mapper.Map(appointmentDto, existingAppointment);
        await _appointmentRepository.UpdateAsync(existingAppointment);

        return _mapper.Map<AppointmentDto>(existingAppointment);
    }

    public async Task DeleteAsync(int id)
    {
        await _appointmentRepository.DeleteAsync(id);
    }

    //public async Task<List<AppointmentDto>> GetAppointmentsByPatientIdAsync(int patientId)
    //{
    //    var appointments = await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);
    //    return await GetAppointmentsWithRelatedNamesAsync(appointments, isDoctor: false);
    //}

    //public async Task<List<AppointmentDto>> GetAppointmentsByDoctorIdAsync(int doctorId)
    //{
    //    var appointments = await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);
    //    return await GetAppointmentsWithRelatedNamesAsync(appointments, isDoctor: true);
    //}

    //private async Task<List<AppointmentDto>> GetAppointmentsWithRelatedNamesAsync(IEnumerable<Appointment> appointments, bool isDoctor)
    //{
    //    if (appointments == null || !appointments.Any())
    //        throw new KeyNotFoundException("No appointments found.");

    //    Dictionary<int, string> patientDictionary = new();
    //    Dictionary<int, string> doctorDictionary = new();

    //    if (isDoctor)
    //    {
    //        var patientIds = appointments.Select(a => a.PatientId).Distinct().ToList();
    //        var patients = await _patientRepository.GetByIdsAsync(patientIds);
    //        patientDictionary = patients.ToDictionary(p => p.Id, p => $"{p.FirstName} {p.LastName}");
    //    }
    //    else
    //    {
    //        var doctorIds = appointments.Select(a => a.DoctorId).Distinct().ToList();
    //        var doctors = await _doctorRepository.GetByIdsAsync(doctorIds);
    //        doctorDictionary = doctors.ToDictionary(d => d.Id, d => $"{d.FirstName} {d.LastName}");
    //    }

    //    return AppointmentMapper.ToDtoList(appointments, isDoctor, patientDictionary, doctorDictionary);
    //}
}