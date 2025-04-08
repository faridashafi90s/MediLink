using MediLink.Application.DTOs;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();
    Task<PatientDto> GetByIdAsync(int id);
    Task<PatientDto> CreateAsync(PatientDto patientDto);
    Task<PatientDto> UpdateAsync(int id, PatientDto patientDto);
    Task DeleteAsync(int id);
}
