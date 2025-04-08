using MediLink.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var appointments = await _appointmentService.GetAllAsync();
        return Ok(appointments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var appointment = await _appointmentService.GetByIdAsync(id);
        if (appointment == null) return NotFound();
        return Ok(appointment);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] AppointmentDto appointmentDto)
    {
        var createdAppointment = await _appointmentService.CreateAsync(appointmentDto);
        return CreatedAtAction(nameof(GetById), new { id = createdAppointment.Id }, createdAppointment);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AppointmentDto appointmentDto)
    {
        var updatedAppointment = await _appointmentService.UpdateAsync(id, appointmentDto);
        return Ok(updatedAppointment);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _appointmentService.DeleteAsync(id);
        return NoContent();
    }

    //[HttpGet("patient/{patientId}")]
    //public async Task<IActionResult> GetAppointmentsByPatient(int patientId)
    //{
    //    var appointments = await _appointmentService.GetAppointmentsByPatientIdAsync(patientId);
    //    return Ok(appointments);
    //}

    //[HttpGet("doctor/{doctorId}")]
    //public async Task<IActionResult> GetAppointmentsByDoctor(int doctorId)
    //{
    //    var appointments = await _appointmentService.GetAppointmentsByDoctorIdAsync(doctorId);
    //    return Ok(appointments);
    //}

}