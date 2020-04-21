using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Amazon.Runtime.CredentialManagement;
using Amazon.Runtime;
using Amazon.MTurk;
using Amazon.MTurk.Model;
using MindOverMapper_Movim.Helpers;
using MindOverMapper_Movim.Models;

namespace MindOverMapper_Movim.Surveys
{
    public class TurkSurvey
    {
        AppSettings _appSettings;
        Survey _survey;
         public TurkSurvey(AppSettings appSettings)
        {
            _appSettings = appSettings;

           
            var options = new CredentialProfileOptions
            {

                AccessKey = _appSettings.awsAccessKey,
                SecretKey = _appSettings.awsSecret
            };
            var profile = new CredentialProfile("basic_profile", options);
            profile.Region = Amazon.RegionEndpoint.USEast1;
            var sharedFile = new SharedCredentialsFile();
            sharedFile.RegisterProfile(profile);
        }

        public AmazonMTurkClient getMTurkClient()
        {
            try
            {
                AmazonMTurkConfig config = new AmazonMTurkConfig();
                config.ServiceURL = _appSettings.awsTurkEndpoint;
                AmazonMTurkClient client = new AmazonMTurkClient(_appSettings.awsAccessKey, _appSettings.awsSecret, config);
                return client;
            }catch(Exception e)
            {

            }

            throw new Exception("Could not load Mturk Credentials");
        }

        public async Task<string> getBalance()
        {
            AmazonMTurkClient client = this.getMTurkClient();
            GetAccountBalanceRequest BalanceRequest = new GetAccountBalanceRequest();
            try
            {
                GetAccountBalanceResponse response = await client.GetAccountBalanceAsync(BalanceRequest);
                return response.AvailableBalance;
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
            }
            throw new Exception("Uh OH! Something went wrong!");
        }

        public async Task<CreateHITResponse> createHit(Survey survey, string reward, int maxSurveys)
        {
            CreateHITResponse response = new CreateHITResponse();
            try
            {
                this._survey = survey;
                AmazonMTurkClient client = this.getMTurkClient();
                string questionXML = "";
                CreateHITRequest hitRequest = new CreateHITRequest();
                hitRequest.Title = this._survey.SurveyName;
                hitRequest.Reward = reward;
                hitRequest.Question = this.getExternalForm();
                hitRequest.Description = this._survey.Notes;
                hitRequest.AssignmentDurationInSeconds = 7200;
                hitRequest.LifetimeInSeconds = 7200;
                hitRequest.MaxAssignments = maxSurveys;
                Qualification qualification = new Qualification();
                qualification.QualificationTypeId = "00000000000000000071";
                QualificationType qType = new QualificationType();
                System.Threading.CancellationToken token = new System.Threading.CancellationToken();
                response = await client.CreateHITAsync(hitRequest, token);
                return response;
            }
            catch(Exception e)
            {
                Console.Write(e);
                return response;
            }
           
           
        }

        private String getExternalForm()
        {
            string externalForm = @"<?xml version='1.0' encoding='UTF-8'?>
                <ExternalQuestion xmlns='http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd'>
                    <ExternalURL>https://idea-creator.com/surveys</ExternalURL>
                    <FrameHeight>0</FrameHeight>
                </ExternalQuestion>";

            return externalForm;
        }
    }
}
