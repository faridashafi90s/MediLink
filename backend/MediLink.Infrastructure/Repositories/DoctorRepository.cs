using MediLink.Application.Interfaces;
using MediLink.Domain.Entities;
using MediLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Infrastructure.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly AppDbContext _context;

        public DoctorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Doctor>> GetAllAsync() =>
            await _context.Doctors.ToListAsync();

        public async Task<Doctor> GetByIdAsync(int id) =>
            await _context.Doctors.FindAsync(id);

        public async Task<IEnumerable<Doctor>> GetByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Doctors
                .Where(d => ids.Contains(d.Id))
                .ToListAsync();
        }

        public async Task AddAsync(Doctor Doctor)
        {
            await _context.Doctors.AddAsync(Doctor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Doctor Doctor)
        {
            _context.Doctors.Update(Doctor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var Doctor = await _context.Doctors.FindAsync(id);
            if (Doctor != null)
            {
                _context.Doctors.Remove(Doctor);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> Exists(string email) =>
            await _context.Doctors.AnyAsync(d => d.Email == email);

        public async Task<Doctor?> GetByEmail(string email) =>
            await _context.Doctors.FirstOrDefaultAsync(d => d.Email == email);
    }
}
