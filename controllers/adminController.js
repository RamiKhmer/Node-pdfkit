const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { dash } = require("pdfkit");

const reportName = "test.pdf";
const reportPath = path.join("data", "report", reportName);

exports.getIndex = (req, res, next)=> {
    res.render('index');
};


const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam insuscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultricesposuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eulacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.';


const invoice = {
    shipping: {
      name: "Ly Rozimy",
      address: "1234 Main Street",
      city: "Serey Sophon",
      state: "PP",
      country: "KH",
      postal_code: 94111
    },
    items: [
      {
        item: "USB_EXT",
        description: "USB Cable Extender",
        quantity: 1,
        amount: 2000
      },
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000
      },
      {
        item: "USB_EXT",
        description: "USB Cable Extender",
        quantity: 1,
        amount: 2000
      },
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000
      },
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000
      },
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000
      },
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000
      },
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
  };

  

exports.getReport = (req, res , next)=> {

createInvoice(invoice, reportPath, res);

};


function createInvoice(invoice, path, res) {
    let doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + reportName + '"'
    );

    doc.pipe(fs.createWriteStream(reportPath));
    doc.pipe(res);
  
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);
    doc.end();
  }

  function generateHeader(doc) {
    let imgPath = (__dirname+ '/../data/images/img.png');  
    doc
      .image(imgPath, 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("NMU Inc.", 110, 57)
      .fontSize(10)
      .text("NMU Store, Mng", 200, 50, {align: "right"})
      .text("Nation Road No5", 200, 65, { align: "right" })
      .text("Tek Thla, Serey Sophon, BMC, Cambodia", 200, 80, { align: "right" })
      .moveDown();
  }
  
  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50, 700,
        { align: "center", width: 500 }
      );
  }

  function generateCustomerInformation(doc, invoice) {
    const shipping = invoice.shipping;
    
    doc.fontSize(20).text('Invoice', 50, 160).fontSize(10);
    doc.moveTo(50, 185)   
        .lineTo(550, 185)
        .stroke();
    doc
      .text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
      .text(`Invoice Date: ${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`, 50, 215)
      .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 230)
  
      .text(shipping.name, 300, 200)
      .text(shipping.address, 300, 215)
      .text(`${shipping.city}, ${shipping.state}, ${shipping.country}`, 300, 230)
      .moveDown();

      doc.moveTo(50, 250)   
      .lineTo(550, 250)
      .stroke();  

      doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('No', 50, 300)
      .text('Name', 80, 300)
      .text('Desc', 180, 300)
      .text('Amount', 280, 300, { width: 90, align: "right" })
      .text('Quantity', 370, 300, { width: 90, align: "right" })
      .text('Total', 0, 300, { align: "right" });
  }

  function generateTableRow(doc, y, c0, c1, c2, c3, c4, c5) {
    
    doc.moveTo(50, y-10)   
    .lineTo(560, y-10)
    .dash(1)
    .stroke();   
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${c0} - `, 50, y)
      .text(c1, 80, y)
      .text(c2, 180, y)
      .text(c3, 280, y, { width: 90, align: "right" })
      .text(c4, 370, y, { width: 90, align: "right" })
      .text(c5, 0, y, { align: "right" });
  }

  function generateInvoiceTable(doc, invoice) {
    let i,
      invoiceTableTop = 330;
    let y = 1;
    let n = 1;
    let total = 0;
    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position-30,
        n,
        item.item,
        item.description,
        item.amount / item.quantity,
        item.quantity,
        item.amount * item.quantity
      );
      total += item.amount * item.quantity;
      n++;
      y = position;
    }

    doc.moveTo(50, y)   
    .lineTo(560, y)
    .stroke();   

    doc.fillColor('red').fontSize(20).text(`Total: $ ${total}`, 400, y+10, {align: "right"});
  }

