using System.Text.Json.Serialization;

namespace MediLink.Application.DTOs
{
    public class AppointmentDto
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("patientId")]
        public int PatientId { get; set; }

        [JsonPropertyName("doctorId")]
        public int DoctorId { get; set; }

        [JsonPropertyName("patientName")]
        public string PatientName { get; set; } = string.Empty;

        [JsonPropertyName("doctorName")]
        public string DoctorName { get; set; } = string.Empty;

        [JsonPropertyName("appointmentDate")]
        public DateTime AppointmentDate { get; set; }

        [JsonPropertyName("status")]
        public int Status { get; set; }
    }
}
