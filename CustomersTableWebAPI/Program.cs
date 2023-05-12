using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace Task1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure logging
            builder.Logging.ClearProviders(); // Clear existing logger providers (optional)
            builder.Logging.AddConsole(); // Add Console logger provider

            // Set the working directory to the project's root directory
            Directory.SetCurrentDirectory(AppContext.BaseDirectory);

            // Add services to the container.
            builder.Services.AddRazorPages();
            builder.Services.AddControllers();

            var app = builder.Build();

            // Get the path to the database file relative to the application's working directory
            var dbPath = Path.Combine("data", "CustomerDb.mdb");

            // Set the connection string for the OleDbConnection
            var connectionString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={dbPath}";

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            // Configure CORS
            app.UseCors(builder => builder
                .WithOrigins("http://127.0.0.1:5500") // Live Server
                .WithOrigins("http://localhost:3000") // React
                .WithOrigins("null") // Allow requests from 'null' origin
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });

            app.Run();
        }
    }
}
