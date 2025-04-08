using System.Text.Json.Serialization;

namespace MediLink.Application.DTOs
{
    public class RegisterDto
    {
        [JsonPropertyName("doctor")]
        public DoctorDto? Doctor { get; set; }

        [JsonPropertyName("patient")]
        public PatientDto? Patient { get; set; }

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("role")]
        public UserRole Role { get; set; }
    }

}
