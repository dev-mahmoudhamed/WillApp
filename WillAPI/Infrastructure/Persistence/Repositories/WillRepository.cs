using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Persistence.Repositories
{
    public class WillRepository : GenericRepository<Will>, IWillRepository
    {
        public WillRepository(ApplicationDbContext context) : base(context)
        {

        }


        public async Task<IReadOnlyList<Will>> GetAllWillsAsync(string userId)
        {
            return await _context.Set<Will>().AsNoTracking().Where(w => w.UserId == userId).ToListAsync();
        }

        public async Task<Will> FindWillAsync(string userId, Expression<Func<Will, bool>> predicate)
        {
            return await _context.Set<Will>().Where(predicate).FirstOrDefaultAsync();
        }

        public async Task<Will> GetByIdAsync(int id)
        {
            return await _context.Set<Will>().FindAsync(id);
        }

        public async Task AddWillAsync(string userId, Will entity)
        {
            entity.UserId = userId;
            await _context.Set<Will>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }
        public void DeleteWill(Will entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
            {
                _context.Set<Will>().Attach(entity);
            }
            _context.Set<Will>().Remove(entity);
            _context.SaveChanges();
        }

        public void UpdateWill(Will entity)
        {
            // _dbSet.Attach(entity);
            // _context.Entry(entity).State = EntityState.Modified;
            _context.Update(entity);
            _context.SaveChanges();
        }


    }
}
