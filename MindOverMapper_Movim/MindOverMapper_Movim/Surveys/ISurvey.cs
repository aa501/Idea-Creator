using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MindOverMapper_Movim.Models;

namespace MindOverMapper_Movim.Surveys
{
    public interface ISurvey
    {
        void LoadSurvey(Survey Survey);
        void execute();
    }
}
