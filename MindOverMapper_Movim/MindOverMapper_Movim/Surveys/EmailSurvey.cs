using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MindOverMapper_Movim.Models;

namespace MindOverMapper_Movim.Surveys
{
    public class EmailSurvey : ISurvey
    {
        private Survey Survey;

        void ISurvey.LoadSurvey(Survey Survey)
        {
            this.Survey = Survey;
        }

        void ISurvey.execute()
        {

        }

    }
}
