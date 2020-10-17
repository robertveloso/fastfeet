const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const device = new escpos.USB();

const options = { encoding: "cp863" };

const printer = new escpos.Printer(device, options);

device.open(function (error) {
  printer
    .drawLine()
    .font("a")
    .align("ct")
    .style("bu")
    .size(2, 2)
    .text("Açai Food JBA")
    .text("Pedido: #001")
    // .barcode("1234567", "EAN8")
    .newLine()
    .marginLeft(5)
    .size(1, 1)
    .align("lt")
    .text("Açai 300ml")
    .text("1 x Paçoca")
    .text("1 x Leite Condensado")
    .text("1 x Leite Ninho")
    .text("2 x Bis")
    .text("-------------------------------")
    // .drawLine()
    .text("Açai 300ml")
    .text("1 x Paçoca")
    .text("1 x Leite Ninho")
    .text("1 x Bis")
    // .newLine(function (err) {
    //   this.cut();
    //   this.close();
    // });
    .qrimage("acaifood.com.br", function (err) {
      this.cut();
      this.close();
    });
});
