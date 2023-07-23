// require('mongoose');
const Contact = require('./../Model/contactModel');
const dal = require('./../Utils/DAL');

exports.createContact = async (req, res) => {
    try{

        let seeIfExisting, flagAnyOneNull = false;
        
        if(!req.body.email && req.body.phone){
            seeIfExisting = await Contact.findOne({phone: req.body.phone});
            flagAnyOneNull = true;
        }
        else if(req.body.email && !req.body.phone){
            seeIfExisting = await Contact.findOne({email: req.body.email});
            flagAnyOneNull = true;
        }
        else if(!req.body.email  && !req.body.phone){
            flagAnyOneNull = true;
            return res.status(200).json({
                status: "Success",
                data: null
            });
        }

        if(flagAnyOneNull){
        if(!seeIfExisting){
            req.body.accountStatus = 'Primary';
            const accounts = await Contact.find();
            req.body._id = accounts.length + 1;
        
            const contact = await Contact.create(req.body);
            const contacts = {
                    primaryContactId: contact._id,
                    emails: [contact.email],
                    phoneNumbers: [contact.phone],
                    secondaryContactIds: [],
                }

            return res.status(200).json(contacts);
        }
        else{
            const contacts = await dal.createContactResponseSec(seeIfExisting);
            return res.status(200).json(contacts);
        }
    }else{

        let matchingContactEmail, matchingContactPhone, response;
        matchingContactEmail = await Contact.findOne({email : req.body.email});
        matchingContactPhone = await Contact.findOne({phone: req.body.phone});

        // Email(Acc Matched with Email) 
        // PPhone(Acc Matched with Phone)

                // - 'Y' (for Matched)
                // - 'N' (for Not Matched)
        let globalPrimaryId;
        // E - Y | P - N
        if(matchingContactEmail && !matchingContactPhone){
            //matchingContactEmail - Primary | Secondary
            if(matchingContactEmail.accountStatus === 'Secondary'){
                req.body.linkedId = matchingContactEmail.linkedId;
            }
            else{
                req.body.linkedId = matchingContactEmail._id;
            }
            req.body.accountStatus = 'Secondary';
            const contacts = await Contact.find();
            req.body._id = contacts.length + 1;
            
            const contact = await Contact.create(req.body);
            response = await dal.createContactResponseSec(matchingContactEmail);
        }
        // P - Y | E - N
        else if(matchingContactPhone && !matchingContactEmail){
            //matchingContactPhone - Primary | Secondary
            if(matchingContactPhone.accountStatus === 'Secondary'){
                req.body.linkedId = matchingContactPhone.linkedId;
            }
            else{
                req.body.linkedId = matchingContactPhone._id;
            }

            req.body.accountStatus = 'Secondary';
            const contacts = await Contact.find();
            req.body._id = contacts.length + 1;
            
            const contact = await Contact.create(req.body);
            response = await dal.createContactResponseSec(matchingContactPhone);
        }
        // E - Y | P - Y
        else if(matchingContactEmail && matchingContactPhone){
            // Primary - Primary 
            if(matchingContactEmail.accountStatus === "Primary" && matchingContactPhone.accountStatus === 'Primary'){
                if(matchingContactEmail._id < matchingContactPhone._id){
                    await dal.updateAllLinkedIds(matchingContactPhone._id, matchingContactEmail._id);
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
                else if(matchingContactEmail._id > matchingContactPhone._id){
                    await dal.updateAllLinkedIds(matchingContactEmail._id, matchingContactPhone._id);
                    response = await dal.createContactResponseSec(matchingContactPhone);
                }
                else{
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
            }
            // Secondary - Secondary
            else if(matchingContactEmail.accountStatus === "Secondary" && matchingContactPhone.accountStatus === "Secondary"){
                if(matchingContactEmail.linkedId < matchingContactPhone.linkedId){
                    await dal.updateAllLinkedIds(matchingContactPhone.linkedId, matchingContactEmail.linkedId);
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
                else if(matchingContactEmail.linkedId > matchingContactPhone.linkedId){
                    await dal.updateAllLinkedIds(matchingContactEmail.linkedId, matchingContactPhone.linkedId);
                    response = await dal.createContactResponseSec(matchingContactPhone);
                }
                else{
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
            }
            // Primary - Secondary
            else if(matchingContactEmail.accountStatus === 'Primary' && matchingContactPhone.accountStatus === 'Secondary'){
                
                if(matchingContactEmail._id < matchingContactPhone.linkedId){
                    await dal.updateAllLinkedIds(matchingContactPhone.linkedId, matchingContactEmail._id);
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
                else if(matchingContactEmail._id > matchingContactPhone.linkedId){
                    await dal.updateAllLinkedIds(matchingContactEmail._id, matchingContactPhone.linkedId);
                    response = await dal.createContactResponseSec(matchingContactPhone);
                }
                else{
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
            }
            // Secondary - Primary
            else if(matchingContactEmail.accountStatus === 'Secondary' && matchingContactPhone.accountStatus === 'Primary'){
                if(matchingContactEmail.linkedId < matchingContactPhone._id){
                    await dal.updateAllLinkedIds(matchingContactPhone._id, matchingContactEmail.linkedId);
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
                else if(matchingContactEmail.linkedId > matchingContactPhone._id){
                    await dal.updateAllLinkedIds(matchingContactEmail.linkedId, matchingContactPhone._id);
                    response = await dal.createContactResponseSec(matchingContactPhone);
                }
                else{
                    response = await dal.createContactResponseSec(matchingContactEmail);
                }
            }
        }
        // E - 'N' | P - 'N'
        else{
            req.body.accountStatus = 'Primary';
            const accounts = await Contact.find();
            req.body._id = accounts.length + 1;

            const contact = await Contact.create(req.body);
            response = {
                primaryContactId: req.body._id,
                emails: [req.body.email],
                phoneNumbers: [req.body.phone],
                secondaryContactIds: [],
            }
        }
        

        res.status(201).json({
            status: "Success",
            contacts: response
        });
    }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }

}

exports.getAllContacts = async (req, res) => {
    try {
    const contacts = await Contact.find();

    res.status(200).json({
        status: "Success",
        count: contacts.length,
        data: {
            contacts
        }
    });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
}