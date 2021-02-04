const { ServiceBusClient } = require('@azure/service-bus');

module.exports = async (subscription) => {
  const connectionString = process.env.ServiceBusConnectionString;

  const queueName = 'deployment';

  const sbClient = new ServiceBusClient(connectionString);

  const sender = sbClient.createSender(queueName);

  const messages = [
    {
      contentType: 'application/json',
      body: subscription,
    },
  ];

  try {
    let batch = await sender.createMessageBatch();
    for (const message of messages) {
      if (!batch.tryAddMessage(message)) {
        await sender.sendMessages(batch);
        batch = await sender.createMessageBatch();

        if (!batch.tryAddMessage(message)) {
          throw new Error('Message too big to fit in a batch');
        }
      }
    }

    await sender.sendMessages(batch);
    await sender.close();
  } catch (err) {
    return `An error as occured: ${err}`;
  } finally {
    await sbClient.close();
  }
};
