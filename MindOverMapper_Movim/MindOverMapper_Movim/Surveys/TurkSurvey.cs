using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Amazon.Runtime.CredentialManagement;
using Amazon.MTurk;
using Amazon.MTurk.Model;
using Amazon.Runtime.CredentialManagement;
using MindOverMapper_Movim.Helpers;
using MindOverMapper_Movim.Models;

namespace MindOverMapper_Movim.Surveys
{
    public class TurkSurvey
    {
        AppSettings _appSettings;
        Survey _survey;
         public TurkSurvey(IOptions<AppSettings> appSettings, Survey Survey)
        {
            _appSettings = appSettings.Value;
            this._survey = Survey;

            AmazonMTurkConfig config = new AmazonMTurkConfig();
            config.ServiceURL = _appSettings.awsTurkEndpoint;
            var options = new CredentialProfileOptions
            {

                AccessKey = _appSettings.awsAccessKey,
                SecretKey = _appSettings.awsSecret
            };
            var profile = new CredentialProfile("basic_profile", options);
            profile.Region = Amazon.RegionEndpoint.USEast1;
            var netSDKFile = new NetSDKCredentialsFile();
            netSDKFile.RegisterProfile(profile);
        }

        public void ReceivedAccountBalance(GetAccountBalanceResponse response)
        {

        }

        public AmazonMTurkClient getMTurkClient()
        {
            var chain = new CredentialProfileStoreChain();
            Amazon.Runtime.AWSCredentials credentials;
            if (chain.TryGetAWSCredentials("basic_profile", out credentials))
            {
                AmazonMTurkClient client = new AmazonMTurkClient(credentials);
                return client;
            }

            throw new Exception("Could not load Mturk Credentials");
        }

        async public Task<string> getBalance()
        {
            AmazonMTurkClient client = this.getMTurkClient();
            GetAccountBalanceRequest BalanceRequest = new GetAccountBalanceRequest();
            GetAccountBalanceResponse response = await client.GetAccountBalanceAsync(BalanceRequest);
            return response.AvailableBalance;
        }

        public async Task<string> createHit()
        {
            AmazonMTurkClient client = this.getMTurkClient();
            string questionXML = "";
            CreateHITRequest hitRequest = new CreateHITRequest();
            hitRequest.Title = this._survey.SurveyName;
            hitRequest.Reward = this._survey.Reward;
            hitRequest.Question = questionXML;
            return "hello";
        }
    }
}
