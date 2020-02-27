using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Concept",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    name = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    headline = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    customer = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    problem = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    promise = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    proof = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    price = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    passion = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    threats = table.Column<string>(unicode: false, maxLength: 1000, nullable: false),
                    ProjectId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Concept", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Links",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    href = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    name = table.Column<string>(unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Links", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    user_id = table.Column<int>(nullable: false),
                    proj_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Permissi__73BA97CD3F6436C6", x => new { x.user_id, x.proj_id });
                });

            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    title = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    description = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    date_created = table.Column<DateTime>(type: "datetime", nullable: false),
                    owner_id = table.Column<int>(nullable: false),
                    stimulus = table.Column<string>(type: "text", nullable: false),
                    definition = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Project_Parameters",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    type = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    content = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    link_id = table.Column<int>(nullable: true),
                    project_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project_Parameters", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "RecoveryGrant",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    email = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    code = table.Column<string>(unicode: false, maxLength: 6, nullable: false),
                    date_sent = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecoveryGrant", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    first_name = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    last_name = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    email = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    password_hash = table.Column<string>(unicode: false, maxLength: 300, nullable: false),
                    type = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    date_created = table.Column<DateTime>(type: "datetime", nullable: false),
                    uid = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    login_attempts = table.Column<int>(nullable: false),
                    lock_out = table.Column<DateTime>(type: "datetime", nullable: true),
                    active = table.Column<byte>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Concept");

            migrationBuilder.DropTable(
                name: "Links");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Project");

            migrationBuilder.DropTable(
                name: "Project_Parameters");

            migrationBuilder.DropTable(
                name: "RecoveryGrant");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
