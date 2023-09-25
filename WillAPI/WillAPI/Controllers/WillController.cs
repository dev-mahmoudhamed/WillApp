using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WillAPI.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]")]

    public class WillController : ControllerBase
    {
        UserManager<AppUser> _userManager;
        private readonly IWillRepository _willRepository;
        private readonly IMapper _mapper;

        public WillController(IWillRepository willRepository, IMapper mapper, UserManager<AppUser> userManager)
        {
            _willRepository = willRepository;
            _mapper = mapper;
            _userManager = userManager;
        }


        private async Task<string> handleFileUpload(WillDto WillDto)
        {


            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            string nameSalt = new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[new Random().Next(s.Length)]).ToArray());

            var filePath = "";

            if (WillDto.FilePath.Equals("new"))
            {
                filePath = Path.Combine(Environment.CurrentDirectory + "/Images", nameSalt + WillDto.Image.FileName);
            }
            else
            {
                filePath = WillDto.FilePath;
            }

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await WillDto.Image.CopyToAsync(fileStream);
            }
            return filePath;
        }


        [HttpPost]
        public async Task<IActionResult> CreateWillAsync([FromForm] WillDto WillDto)
        {
            if (WillDto == null)
            {
                return BadRequest("Invalid Will data.");
            }

            WillDto.FilePath = handleFileUpload(WillDto).Result;
            var will = _mapper.Map<WillDto, Will>(WillDto);
            await _willRepository.AddWillAsync(WillDto.UserId, will);
            return Ok(will);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllWillsAsync(string UserId)
        {
            var Wills = await _willRepository.GetAllWillsAsync(UserId);
            if (Wills == null)
            {
                return NotFound();
            }

            var WillsDto = _mapper.Map<IReadOnlyList<Will>, IReadOnlyList<WillDto>>(Wills);
            return Ok(WillsDto);
        }


        [HttpGet("{Id}")]
        public async Task<IActionResult> GetWillAsync(int Id)
        {

            var will = await _willRepository.GetByIdAsync(Id);
            if (will == null)
            {
                return NotFound();
            }

            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null)
            {
                return NotFound();

            }
            var user = await _userManager.FindByEmailAsync(email);

            if (will.UserId != user.Id)
            {
                return Unauthorized();
            }
            var willDto = _mapper.Map<Will, WillDto>(will);
            var imagePath = will.FilePath;
            var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);
            if (imageBytes == null)
            {
                return StatusCode(500, "Image could not be loaded");
            }

            var response = new
            {
                willInfo = willDto,
                ImageData = Convert.ToBase64String(imageBytes)
            };

            return Ok(response);
        }


        [HttpGet("{willId}/view")]
        public async Task<IActionResult> GetWillById(int willId)
        {

            var will = await _willRepository.GetByIdAsync(willId);
            if (will == null)
            {
                return NotFound();
            }

            var willDto = _mapper.Map<Will, WillDto>(will);
            var imagePath = will.FilePath;
            var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);
            if (imageBytes == null)
            {
                return StatusCode(500, "Image could not be loaded");
            }

            var response = new
            {
                willInfo = willDto,
                ImageData = Convert.ToBase64String(imageBytes)
            };

            return Ok(response);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> UpdateWillAsync(int Id, [FromForm] WillDto WillDto)
        {
            var existingWill = await _willRepository.GetByIdAsync(Id);
            WillDto.FilePath = handleFileUpload(WillDto).Result;

            _mapper.Map(WillDto, existingWill);
            _willRepository.Update(existingWill);

            return Ok(existingWill);
        }


        [HttpPatch("{Id}")]
        public async Task<ActionResult> UpdateWithPatch(int Id, [FromForm] WillUpdateDto updateDto)
        {

            var existingWill = await _willRepository.GetByIdAsync(Id);
            existingWill.MessageContent = updateDto.MessageContent;
            existingWill.PublishDate = updateDto.PublishDate;
            _willRepository.Update(existingWill);
            return Ok(existingWill);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWill(int id)
        {
            var existingWill = await _willRepository.GetByIdAsync(id);

            if (existingWill == null)
            {
                return NotFound();
            }

            _willRepository.Delete(existingWill);

            return Ok();
        }

    }
}

