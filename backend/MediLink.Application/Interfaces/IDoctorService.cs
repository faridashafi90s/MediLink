using MediLink.Application.DTOs;

public interface IDoctorService
{
    Task<IEnumerable<DoctorDto>> GetAllAsync();
    Task<DoctorDto> GetByIdAsync(int id);
    Task<DoctorDto> CreateAsync(DoctorDto DoctorDto);
    Task<DoctorDto> UpdateAsync(int id, DoctorDto DoctorDto);
    Task DeleteAsync(int id);
}
