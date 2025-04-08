IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Appointments]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Appointments](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [PatientId] INT NOT NULL,
    [DoctorId] INT NOT NULL,
    [AppointmentDate] DATETIME2(7) NOT NULL,
    [Status] INT NOT NULL
)
END
GO
