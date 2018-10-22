from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost:9999'))
channel = connection.channel()

analyser = SentimentIntensityAnalyzer()
channel.queue_declare(queue='predict')

def predict(ch, method, properties, body):
    scores = analyser.polarity_scores(body)
    channel.basic_publish(exchange='',
                        routing_key='predict',
                        body=str(scores))


channel.basic_consume(predict,
                      queue='tweet',
                      no_ack=True)