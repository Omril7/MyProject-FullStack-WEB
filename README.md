# MyProject - FullStack WEB
Exams System web application 

<p align="left">
  <a href="https://docs.microsoft.com/en-us/dotnet/csharp/" target="_blank" rel="noreferrer">
    <img src="https://cdn.worldvectorlogo.com/logos/c--4.svg" width="36" height="36" alt="C#" />
  </a>
  <a href="https://dotnet.microsoft.com/en-us/" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/dotnet/dotnet-icon.svg" width="36" height="36" alt=".NET" />
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg" width="36" height="36" alt="HTML5"/>
  </a>
  <a href="https://www.w3.org/TR/CSS/#css" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg" width="36" height="36" alt="CSS3"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
    <img src="https://cdn.worldvectorlogo.com/logos/javascript-1.svg" width="36" height="36" alt="JavaScript" />
  </a>
  <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" width="40" height="36" alt="Bootstrap"/>
  </a>
  <a href="https://www.mysql.com/" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg" width="36" height="36" alt="MySQL"/>
  </a>
</p>

### Add DB
1. Initialize SQL Server on your Visual Studio (If you dont have one)
2. Add new DataBase for Teachers to your SQL Server
3. Copy your DataBase ConnectionString (Right click on DB -> Properties -> ConnectionString)
4. Open appsettings.json file in the TelHai.FullStackWEB project
5. Paste the ConnectionString in line 10 : "TeacherContext": "{ConnectionString}"
6. Add new DataBase for Students to your SQL Server
7. Copy your DataBase ConnectionString (Right click on DB -> Properties -> ConnectionString)
8. Open appsettings.json file in the TelHai.FullStackWEB project
9. Paste the ConnectionString in line 10 : "TeacherContext": "{ConnectionString}"
10. Open the Package Manager Console (Tools -> NuGet Package Manager -> Package Manager Console)
11. Write Update-DataBase -Context TeacherContext
12. Write Update-DataBase -Context StudentContext
