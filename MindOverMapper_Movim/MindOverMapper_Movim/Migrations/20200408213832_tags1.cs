using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class tags1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "tags",
                table: "Question",
                type: "nvarchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    name = table.Column<string>(unicode: false, maxLength: 1000, nullable: false),
                    description = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    notes = table.Column<string>(unicode: false, maxLength: 1000, nullable: true),
                    date_created = table.Column<DateTime>(type: "datetime", nullable: false),
                    archived = table.Column<string>(unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DropColumn(
                name: "tags",
                table: "Question");
        }
    }
}
