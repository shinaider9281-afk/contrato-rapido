const express = require('express');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// TOKEN JA COLADO
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5429596188855478-102012-ae445d657dcad1235725e9f4b1344a23-435353179';

const client = new MercadoPagoConfig({ 
  accessToken: MERCADOPAGO_ACCESS_TOKEN 
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/criar-pagamento', async (req, res) => {
  try {
    const payment = new Payment(client);
    const body = {
      transaction_amount: 9.99,
      description: 'Contrato Rapido - PDF',
      payment_method_id: 'pix',
      payer: { email: 'cliente@email.com' }
    };
    const result = await payment.create({ body });
    res.json({
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
      id: result.id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao gerar Pix' });
  }
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
