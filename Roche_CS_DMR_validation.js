/***************************************************************************************  
 ** Copyright (c) 1998-2012 Softype, Inc.                                 
 ** Morvi House, 30 Goa Street, Ballard Estate, Mumbai 400 001, India
 ** All Rights Reserved.                                                    
 **                                                                         
 ** This software is the confidential and proprietary information of Softype, Inc. ("Confidential Information"). 
 **You shall not disclose such Confidential Information and shall use it only in accordance with the terms of
 ** the license agreement you entered into with Softype.                  
 **                       
 **@Author :          Curie Dsouza
 **@Dated :            6/5/2013
 **@Version :         Revised version
 **@Description : Return quantity validation
 ***************************************************************************************/

function LineValidate_Returnqty() 
{
	var GetItem = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_item');
	if(GetItem!= null)
	{
		var Itemtype = nlapiLookupField('item', GetItem, 'recordType');
		//alert(Itemtype);
		var LoadRec = nlapiLoadRecord(Itemtype,GetItem);
		var CogsAccount = LoadRec.getFieldValue('cogsaccount');

		//alert(CogsAccount);
		if(CogsAccount!= null)
		{
			nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue', 'custrecord_dmr_cogs', CogsAccount);
		}
	}


	//validation to check whether issue quantity is more than return quantity 
/*	var iss_qty = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue', 'custrecord_matreturnitem_issqty');

	var return_qty = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue', 'custrecord_matreturnitem_qty');

	if(Number(iss_qty) < Number(return_qty))
	{
		alert('Return Quantity cant be more than Issue Quantity');
		return false;
	}*/

	return true;



}


function PInIt_DisableLine(type)
{

	/*var pmrdmr= nlapiGetFieldValue('custrecord_dmrret_pmr'); 
if(pmrdmr == null || pmrdmr == '')
{
alert("Please create DMR from Project Material Request -> Daily Material Return");

window.location = 'https://system.na1.netsuite.com/app/common/entity/joblist.nl';           

}*/ 




	var status=nlapiGetFieldValue('custrecord_matreturn_status');
	//alert('status'+status);
	if(status== 4 || status== 5)
	{   // disable line items when status is issued(4) or returned(5)
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_dmrreturn_bin',true);	
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_issqty',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_item',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_location',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qty',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyrem',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_invtransfer',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_units',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_seriallot',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_overage',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_subsidiary',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_dmr_locationhandle',true);
	}

}


function FL_GetOnHandQnt(type, fld)
{
	var OnHandBin =0;
	if(type == 'recmachcustrecord_matreturnitem_matissue' && fld ==  'custrecord_matreturnitem_location')
	{

		var DmsLocation = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_location');

		var DmsBin = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_dmrreturn_bin');

		if(DmsBin != null && DmsBin!= '')
		{

			var DmsItem = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_item');
			var ItemType=nlapiLookupField('item', DmsItem, 'recordType');     // get item from line item search in item record
			var LoadItem = nlapiLoadRecord(ItemType ,DmsItem);               // load item record and get bin number and location 
			var BinCount = LoadItem.getLineItemCount('binnumber');

			for(var binno = 1; binno<= BinCount ; binno++)
			{
				var BinNumber = LoadItem.getLineItemValue('binnumber','binnumber',binno);

				var BinLocation = LoadItem.getLineItemValue('binnumber','location',binno);

				nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',0);

				if(DmsLocation == BinLocation && DmsBin == BinNumber )
				{
					OnHandBin = LoadItem.getLineItemValue('binnumber','onhand',binno);   // get number onhand from bin sub tab on item record and set it on dmr quantityonhand field


					if(OnHandBin == null || OnHandBin == '' || OnHandBin ==0)
					{
						alert('Qnt on hand is not available for this location of this bin');
						nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',OnHandBin);

					}
					else
					{
						nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',OnHandBin);

					}

					break;
				}

				/*else
				{
					alert('Qnt on hand is not available for this location of this bin');
					nlapiSetCurrentLineItemValue('recmachcustrecord_matissueitem_matissue','custrecord_matissueitem_qtyonhand',OnHandBin);
				}*/
			}
		}
	}
	if(type == 'recmachcustrecord_matreturnitem_matissue' && fld ==  'custrecord_dmrreturn_bin')
	{
		var DmsLocation = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_location');  // get location value from dmr record
		var DmsBin = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_dmrreturn_bin');                // get bin value from dmr record
		if(DmsLocation != null && DmsLocation!= '')
		{

			var DmsItem = nlapiGetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_item');
			var ItemType=nlapiLookupField('item', DmsItem,'recordType');   // search for item record in item master
			var LoadItem = nlapiLoadRecord(ItemType, DmsItem);               // load item record
			var BinCount = LoadItem.getLineItemCount('binnumber');
			for(var binno = 1; binno<= BinCount ; binno++)
			{
				var BinNumber = LoadItem.getLineItemValue('binnumber','binnumber',binno);  // get bin number from item record
				var BinLocation = LoadItem.getLineItemValue('binnumber','location',binno); // get location from item record
				nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',0);
				if(DmsLocation == BinLocation && DmsBin == BinNumber )
				{
					OnHandBin = LoadItem.getLineItemValue('binnumber','onhand',binno);
					if(OnHandBin == null || OnHandBin == '' || OnHandBin ==0)
					{
						alert('Qnt on hand is not available for this location of this bin'); // check whether quantityonhand is available for particular location
						nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',OnHandBin); // get number onhand from bin sub tab on item record and set it on dmr quantityonhand field

					}
					else
					{
						nlapiSetCurrentLineItemValue('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',OnHandBin);

					}

					break;
				}
			}
		}

	}

}



function LineInit_LockingLineItem(type)
{
	var status=nlapiGetFieldValue('custrecord_matreturn_status');
	//alert('status'+status);

	// disable line items when status is issued(4) or returned(5)
	if(status== 4 || status== 5)
	{
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_dmrreturn_bin',true);	
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_issqty',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_item',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_location',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qty',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyonhand',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_qtyrem',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_invtransfer',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_units',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_seriallot',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_overage',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_matreturnitem_subsidiary',true);
		nlapiDisableLineItemField('recmachcustrecord_matreturnitem_matissue','custrecord_dmr_locationhandle',true);
	}


}

function clientValidateDelete(type)
{
	//alert('In validate delete');
	var status= nlapiGetFieldValue('custrecord_matreturn_status');

	// if status is returned(5) or cancelled(11) line items cannot be deleted
	if(status== 5 || status== 11)
	{
		alert('You cannot delete line item when status is Returned');
		return false;
	}
	return true;
}