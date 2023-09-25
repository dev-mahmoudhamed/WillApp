using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Interfaces
{
    public interface IWillRepository : IGenericRepository<Will>
    {
        Task<IReadOnlyList<Will>> GetAllWillsAsync(string userId);
        Task<Will> FindWillAsync(string userId, Expression<Func<Will, bool>> predicate);
        Task<Will> GetByIdAsync(int id);
        Task AddWillAsync(string userId, Will entity);
        void DeleteWill(Will entity);
        void UpdateWill(Will entity);
    }


}
