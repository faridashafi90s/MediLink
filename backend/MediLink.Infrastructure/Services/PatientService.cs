using AutoMapper;
using MediLink.Application.DTOs;
using MediLink.Application.Interfaces;
using MediLink.Domain.Entities;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IMapper _mapper;

    public PatientService(IPatientRepository patientRepository, IMapper mapper)
    {
        _patientRepository = patientRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PatientDto>> GetAllAsync()
    {
        var patients = await _patientRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<PatientDto>>(patients);
    }

    public async Task<PatientDto> GetByIdAsync(int id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        return _mapper.Map<PatientDto>(patient);
    }

    public async Task<PatientDto> CreateAsync(PatientDto patientDto)
    {
        var patient = _mapper.Map<Patient>(patientDto);
        await _patientRepository.AddAsync(patient);
        return _mapper.Map<PatientDto>(patient);
    }

    public async Task<PatientDto> UpdateAsync(int id, PatientDto patientDto)
    {
        var existingPatient = await _patientRepository.GetByIdAsync(id);
        if (existingPatient == null) throw new KeyNotFoundException("Patient not found.");

        _mapper.Map(patientDto, existingPatient);
        await _patientRepository.UpdateAsync(existingPatient);

        return _mapper.Map<PatientDto>(existingPatient);
    }

    public async Task DeleteAsync(int id)
    {
        await _patientRepository.DeleteAsync(id);
    }
}
