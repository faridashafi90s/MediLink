using AutoMapper;
using MediLink.Application.DTOs;
using MediLink.Application.Interfaces;
using MediLink.Domain.Entities;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IMapper _mapper;

    public DoctorService(IDoctorRepository doctorRepository, IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DoctorDto>> GetAllAsync()
    {
        var doctors = await _doctorRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }

    public async Task<DoctorDto> GetByIdAsync(int id)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);
        return _mapper.Map<DoctorDto>(doctor);
    }

    public async Task<DoctorDto> CreateAsync(DoctorDto doctorDto)
    {
        var doctor = _mapper.Map<Doctor>(doctorDto);
        await _doctorRepository.AddAsync(doctor);
        return _mapper.Map<DoctorDto>(doctor);
    }

    public async Task<DoctorDto> UpdateAsync(int id, DoctorDto doctorDto)
    {
        var existingDoctor = await _doctorRepository.GetByIdAsync(id);
        if (existingDoctor == null)
            throw new KeyNotFoundException("Doctor not found.");

        _mapper.Map(doctorDto, existingDoctor);
        await _doctorRepository.UpdateAsync(existingDoctor);

        return _mapper.Map<DoctorDto>(existingDoctor);
    }

    public async Task DeleteAsync(int id)
    {
        await _doctorRepository.DeleteAsync(id);
    }
}