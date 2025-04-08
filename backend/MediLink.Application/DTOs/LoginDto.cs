using System.Text.Json.Serialization;

namespace MediLink.Application.DTOs
{
    public class LoginDto
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("role")]
        public UserRole Role { get; set; }
    }
}
