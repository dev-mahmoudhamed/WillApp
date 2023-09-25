using System.Linq.Expressions;

namespace Application.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> include);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, bool>> include);
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task AddRange(List<T> entities);
        void Update(T entity);
        void Delete(T entity);
    }

}
