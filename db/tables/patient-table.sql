IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Patients]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Patients](
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [FirstName] NVARCHAR(MAX) NOT NULL,
    [LastName] NVARCHAR(MAX) NOT NULL,
    [DateOfBirth] DATETIME2(7) NOT NULL,
    [Gender] NVARCHAR(MAX) NOT NULL,
    [ContactNumber] NVARCHAR(MAX) NOT NULL,
    [Email] NVARCHAR(MAX) NOT NULL,
    [Password] NVARCHAR(MAX) NOT NULL
)
END
GO