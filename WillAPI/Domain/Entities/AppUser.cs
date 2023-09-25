using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{

    public class AppUser : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsDeleted { get; set; } = false;

        public List<Will> Wills { get; set; } // Navigation property for messages

    }
}
