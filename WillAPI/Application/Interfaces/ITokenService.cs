using Domain.Entities;

namespace Application.Interfaces
{
    public interface ITokenService
    { 
        public string CreateToken(AppUser user);
    }
}
