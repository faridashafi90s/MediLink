using MediLink.Application.DTOs;

namespace MediLink.Application.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterUser(RegisterDto request);
        Task<AuthResponseDto?> LoginUser(LoginDto request);
    }
}