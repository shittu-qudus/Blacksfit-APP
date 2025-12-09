// components/CustomPaystackWebView.tsx
import React from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  message: string;
}

interface CustomPaystackWebViewProps {
  paystackKey: string;
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  onSuccess: (response: PaystackResponse) => void;
  onClose: () => void;
  visible: boolean;
}

const CustomPaystackWebView: React.FC<CustomPaystackWebViewProps> = ({
  paystackKey,
  amount,
  email,
  firstName,
  lastName,
  phone,
  onSuccess,
  onClose,
  visible,
}) => {
  if (!visible) return null;

  // Generate a unique reference
  const generateReference = () => {
    return `blackfit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Paystack Payment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .loading {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .error {
            color: #d63031;
            margin: 20px 0;
        }
        .button {
            background: #28a745;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }
        .button:hover {
            background: #218838;
        }
        .button-secondary {
            background: #6c757d;
        }
        .button-secondary:hover {
            background: #545b62;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="loading" class="loading">Initializing payment...</div>
        <div id="error" class="error" style="display: none;"></div>
        <button id="retryButton" class="button" style="display: none;" onclick="initializePayment()">Retry Payment</button>
        <button id="closeButton" class="button button-secondary" style="display: none;" onclick="closePayment()">Close</button>
    </div>

    <script>
        let paymentInitialized = false;

        function initializePayment() {
            const loading = document.getElementById('loading');
            const error = document.getElementById('error');
            const retryButton = document.getElementById('retryButton');
            const closeButton = document.getElementById('closeButton');
            
            loading.style.display = 'block';
            error.style.display = 'none';
            retryButton.style.display = 'none';
            closeButton.style.display = 'none';

            try {
                if (typeof PaystackPop === 'undefined') {
                    throw new Error('Paystack library failed to load. Please check your internet connection.');
                }

                var handler = PaystackPop.setup({
                    key: '${paystackKey}',
                    email: '${email}',
                    amount: ${amount * 100},
                    currency: 'NGN',
                    ref: '${generateReference()}',
                    metadata: {
                        custom_fields: [
                            {
                                display_name: "First Name",
                                variable_name: "first_name",
                                value: '${firstName}'
                            },
                            {
                                display_name: "Last Name", 
                                variable_name: "last_name",
                                value: '${lastName}'
                            },
                            {
                                display_name: "Phone",
                                variable_name: "phone",
                                value: '${phone || 'Not provided'}'
                            }
                        ]
                    },
                    onClose: function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ 
                            type: 'closed',
                            message: 'Payment window closed'
                        }));
                    },
                    callback: function(response) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ 
                            type: 'success', 
                            data: response 
                        }));
                    }
                });

                handler.openIframe();
                paymentInitialized = true;
                loading.textContent = 'Payment window opened...';

            } catch (err) {
                loading.style.display = 'none';
                error.style.display = 'block';
                error.textContent = err.message;
                retryButton.style.display = 'inline-block';
                closeButton.style.display = 'inline-block';
                console.error('Payment initialization error:', err);
            }
        }

        function closePayment() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'closed',
                message: 'User requested to close'
            }));
        }

        // Initialize payment when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializePayment();
        });

        // Fallback initialization
        setTimeout(function() {
            if (!paymentInitialized) {
                initializePayment();
            }
        }, 1000);
    </script>
</body>
</html>
  `;

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    // You can handle navigation changes here if needed
    console.log('Navigation state changed:', navState.url);
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data);
            console.log('Received message from WebView:', message);

            if (message.type === 'success') {
              onSuccess(message.data);
            } else if (message.type === 'closed') {
              onClose();
            }
          } catch (error) {
            console.error('Error parsing WebView message:', error);
          }
        }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});

export default CustomPaystackWebView;