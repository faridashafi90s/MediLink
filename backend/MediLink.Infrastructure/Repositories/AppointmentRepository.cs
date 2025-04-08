using MediLink.Application.Interfaces;
using MediLink.Domain.Entities;
using MediLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppDbContext _context;

        public AppointmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAsync() =>
            await _context.Appointments.ToListAsync();

        public async Task<Appointment> GetByIdAsync(int id) =>
            await _context.Appointments.FindAsync(id);

        public async Task AddAsync(Appointment Appointment)
        {
            await _context.Appointments.AddAsync(Appointment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Appointment Appointment)
        {
            _context.Appointments.Update(Appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var Appointment = await _context.Appointments.FindAsync(id);
            if (Appointment != null)
            {
                _context.Appointments.Remove(Appointment);
                await _context.SaveChangesAsync();
            }
        }

        //public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId)
        //{
        //    return await _context.Appointments
        //        .Where(a => a.PatientId == patientId)
        //        .ToListAsync();
        //} 

        //public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId)
        //{
        //    return await _context.Appointments
        //        .Where(a => a.DoctorId == doctorId)
        //        .ToListAsync();
        //}

    }
}
