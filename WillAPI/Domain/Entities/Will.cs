using Microsoft.AspNetCore.Http;

namespace Domain.Entities
{
    public class Will
    {
        public int Id { get; set; }
        public string MessageContent { get; set; }
        public IFormFile Image { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string PublishDate { get; set; }

        public string UserId { get; set; }
        public AppUser AppUser { get; set; }

    }
}
