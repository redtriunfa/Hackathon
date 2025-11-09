# [OpenPayments](http://mckaycr.github.io/open-payments)

This project is for creating re-usable node modules for querying Open Payments data via the Socrata API.

This is meant to be a module that other developers can use to build search tools for Open Payments data.

## Setup
This package is published in NPM so to install you just need to do the following:
```
npm install open-payments
```
## Example
```
var coveredRecipient = require('open-payments');
options = {
 'id':268527  // This is a physician_profile_id in open payments
 ,'type': 'physician'  //  This is an entity type, later I will allow for more
}

coveredRecipient.identify(options, function(err, data){
    console.log(data)
})
```
## Results
```
[ { physician_profile_address_line_1: '3705 Olentangy River Rd',
    physician_profile_address_line_2: 'Suite 100',
    physician_profile_city: 'Columbus',
    physician_profile_country_name: 'United States',
    physician_profile_first_name: 'GARY',
    physician_profile_id: '268527',
    physician_profile_last_name: 'ANSEL',
    physician_profile_license_state_code_1: 'OH',
    physician_profile_middle_name: 'M',
    physician_profile_primary_specialty: 'Allopathic & Osteopathic Physicians|Internal Medicine|Interventional Cardiology',
    physician_profile_state: 'OH',
    physician_profile_zipcode: '432143467 ' } ]
```

## Prerequisites
- Node is required

## Methods

Unless otherwise specified, available options for all methods are:

- `id` - **Required** This is the open payments id for the entity you want a summary for
- `type` - **Required** This is the entity type you want a summary for.  Available options for this is:
	- `physician`
	- `hospital`
	- `company`

### summary(options);

This method provides a summed total of all stats for a particular entity which should match what the current search tool displays in the summary details for a particular entity.  This is with the exception of teaching hospitals which may have a separate ID per program year.  This module doesn't yet find all associated ID's.  Maybe in the furture

### identify(options);

This method will provide all the information related to the entity being queried, like entity name, address, any licenses associated if applicable.  This is automatically included in the summary method, but just for fun I added it so that you could call it by itself too.

## Credit

- [Open Payments - Centers of Medicare and Medicaid](https://openpaymentsdata.cms.gov/)
- [Socrata](http://dev.socrata.com/foundry/#/openpaymentsdata.cms.gov/y4mv-5s9j)

## Disclaimer

I added universal analytics to my module so that I could get a better idea of what it was being used for, and metrics for how I could improve it's performance.  Hopefully that doesn't deter anyone from continuing use.  You could always go in and take it out.  I will add some optOut process soon. Hopefully it won't be needed :

>***Affiliation Disclosure***: *This project and it's contributors are in no way affiliated with the Open Payments system, Sunshine Act, or ACA.  No compensation is received for work performed on this project.   This project is quite simply a tool for its contributors to hone in on their JavaScripting skills.  Hope you enjoy it, and feel free to contribute.*
