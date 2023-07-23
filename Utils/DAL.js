const Contact = require('./../Model/contactModel');

exports.getSecondaryContacts = (id) => {
    return Contact.find({
      $or: [{ linkedId: id }, { id: id }],
    });
};
  
exports.getExistingContacts = (email, phone) => {
    return Contact.find({
      $or: [{ email: email }, { phone: phone }],
    });
};

exports.createContactResponseSec = ( async (seeIfExisting) => {
    let accounts, uniqueEmailsSet = new Set(), uniquePhonesSet = new Set(), linkedIdsArray = [], globalAcc, pirmaryId;
    if(seeIfExisting.accountStatus === 'Secondary'){
        accounts = await Contact.find({linkedId: seeIfExisting.linkedId})
        globalAcc = await Contact.findOne({_id: seeIfExisting.linkedId});
        uniqueEmailsSet.add(globalAcc.email);
        uniquePhonesSet.add(globalAcc.phone);
        pirmaryId = seeIfExisting.linkedId;
    }
    else{
        accounts = await Contact.find({linkedId: seeIfExisting._id});
        uniqueEmailsSet.add(seeIfExisting.email);
        uniquePhonesSet.add(seeIfExisting.phone);
        pirmaryId = seeIfExisting._id;
    }
            
    accounts.forEach((acc) => {
        if(acc.email) {uniqueEmailsSet.add(acc.email)}
        if(acc.phone) {uniquePhonesSet.add(acc.phone)}
        linkedIdsArray.push(acc._id);
    })

    const contacts = {
        primaryContactId: pirmaryId,
        emails: Array.from(uniqueEmailsSet),
        phoneNumbers: Array.from(uniquePhonesSet),
        secondaryContactIds: linkedIdsArray,
    }

    return contacts;
})

exports.updateContact = (contact) => {
    return contact.save();
}

exports.updateAllLinkedIds = async (toUpdateId, forUpdateId) => {
    const contacts = await Contact.find({linkedId: toUpdateId});
    const contact = await Contact.findOne({_id: toUpdateId});
    contacts.forEach(async (cont) => {
        cont.linkedId = forUpdateId;
        await this.updateContact(cont);
    })
    contact.accountStatus = "Secondary";
    contact.linkedId = forUpdateId;
    await this.updateContact(contact);
}
