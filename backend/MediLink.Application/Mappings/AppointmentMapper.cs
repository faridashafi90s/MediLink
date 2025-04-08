using MediLink.Application.DTOs;
using MediLink.Domain.Entities;

namespace MediLink.Application.Mappers
{
    public static class AppointmentMapper
    {
        public static List<AppointmentDto> ToDtoList(
            IEnumerable<Appointment> appointments,
            Dictionary<int, string> patientDictionary,
            Dictionary<int, string> doctorDictionary)
        {
            return appointments.Select(a => new AppointmentDto
            {
                Id = a.Id,
                PatientId = a.PatientId,
                DoctorId = a.DoctorId,
                PatientName = patientDictionary.GetValueOrDefault(a.PatientId, "Unknown"),
                DoctorName = doctorDictionary.GetValueOrDefault(a.DoctorId, "Unknown"),
                AppointmentDate = a.AppointmentDate,
                Status = (int)a.Status
            }).ToList();
        }
    }
}
