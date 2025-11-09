var path = require('path');
var def = require(__dirname + path.sep + 'definitions.json');

function Covered_Recipient(){
    /*
     * Get Identifying Information about an Entity
     *
     * @param {args}   and object which contains an id and type; example {id:'1234', type:'physician'}
     * @param {function}  callback
     */
	this.identify = function(args, callback /*err,value*/){
		if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}
		query(args, callback)
    };
    this.summary = function(args, callback /*err,value*/){
        if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}
		var results = []
        var queries = createQueries(args);
    	var itemsProcessed = 0;
    	queries.map(function(query){
    		sQuery(query, function(data){
    			query.data = data
    			itemsProcessed++;
    			if(itemsProcessed===queries.length){
    				summarize(queries, function(res){
    					callback(null, res)
    				})
    			}
    		})
    	})

    };
  //   this.records = function(args, callback){
  //   	if(typeof callback !=='function'){
		// 	throw new Error('a callback must be provided');
		// }
		// var results = {};
		// var queries = createQueries(args);
		// var itemsProcessed = 0;
		// queries.map(function(query){
		// 	query.select = '*';
		// 	query.group = null
		// 	query.offset = 0
		// 	sQuesry(query, function(data){
		// 		if(!results.hasOwnProperty(query.year)){results[query.year]={}}
  //   			if(!results[query.year].hasOwnProperty(query.type)){results[query.year][query.type] = {}}
  //   			results[query.year][query.type].records = data.map(function(record){
  //   				return record
  //   			})
  //   			itemsProcessed++;
  //   			if(itemsProcessed===queries.length){
		// 			callback(null, results)
		// 		}
		// 	})
		// })
  //   };
}

module.exports = new Covered_Recipient();

function summarize(data, callback){
	var results = {}
	data.forEach(function(dataset){
		var year = dataset.year
		var type = dataset.type
		if(!results.hasOwnProperty(year)){results[year]={}}
		if(!results[year].hasOwnProperty(type)){results[year][type] = {}}
		dataset.data.forEach(function(flag){
			for(var prop in flag){
				results[year][type][prop]=(results[year][type][prop]==null)?results[year][type][prop] = Number(flag[prop]):results[year][type][prop]=results[year][type][prop]+Number(flag[prop])
			}
		})
		if(dataset.data.length==2){
			results[year][type].disputes = {
				count:dataset.data[1].count,
				value:dataset.data[1].value
			}
		}
	})
	callback(results)
}

/**

	TODO:
	- Combine the two query modules into one

 */

function query(entity, callback){
	var soda = require('soda-js');
	var options = {
}
var op = new soda.Consumer('openpaymentsdata.cms.gov', options);
op.query()
	.withDataset(def.searchFile.endPoint[entity.type])
	.where(def.searchFile.fieldName[entity.type]+"='"+entity.id+"'")
	.getRows()
		.on('success', function(rows){callback(null, rows)})
		.on('error', function(error){callback(error)})
}

function sQuery(params, callback){
	var soda = require('soda-js');
	var results = []
	var options = {
	}
	var test = new soda.Consumer('openpaymentsdata.cms.gov', options);
	test.query()
		.withDataset(params.ep)
		.select(params.select)
		.where( params.query)
		.group(params.group)
		.limit(100000)
		.offset(params.offset)
		.getRows()
			.on('success', function(rows){
				rows.forEach(function(e){
					results.push(e)
				})
				if(rows.length>=100000){
					params.offset = params.offset+100000
					sQuery(params, function(data){
						data.forEach(function(e){
							results.push(e)
						})
						callback(results)
					})
				}else{
					callback(results)
				}
			})
			.on('error', function(error){callback(error)})
}

/**
 *
 * This function reads the definitions 
 * file and stores all the url information 
 * for the publications you want to query. 
 * It will return an array where each element 
 * contians program year, payment type,and 
 * the dataset URL with no paramerters
 *
 */

function createQueries(entityObj){
    var publications = def.datasets;
    var output = [];
    for (var proYear in publications){
        var publication = publications[proYear];
        for (var paymentType in publication) {
            if(entityObj.type=='physician'&&paymentType=='pi'){
                    output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':"physician_profile_id IS NULL OR physician_profile_id!='"+entityObj.id+"') AND (principal_investigator_1_profile_id='"+entityObj.id+"' OR principal_investigator_2_profile_id='"+entityObj.id+"' OR principal_investigator_3_profile_id='"+entityObj.id+"' OR principal_investigator_4_profile_id='"+entityObj.id+"' OR principal_investigator_5_profile_id='"+entityObj.id+"'"});
            }
            switch(entityObj.type){
                case 'company':
                	if(paymentType!='pi'){
                		output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':"applicable_manufacturer_or_applicable_gpo_making_payment_id='"+entityObj.id+"'"});
                	}
                    break;
                case 'hospital':
                	if(paymentType!='ownership'&&paymentType!='pi'){
                		output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':def.searchFile.fieldName[entityObj.type]+"='"+entityObj.id+"'"});
                	}
                	break;
                default:
                    output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':def.searchFile.fieldName[entityObj.type]+"='"+entityObj.id+"'"});
                    break;
            }
        }
    }
    return output;
}


