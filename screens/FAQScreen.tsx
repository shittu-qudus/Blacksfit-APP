import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { ChevronDown, Package, Truck, RefreshCw, CreditCard, Shirt, Users } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const BlacksfitFAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());
  const [animations] = useState(new Map());

  const toggleItem = (itemIndex: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemIndex)) {
      newOpenItems.delete(itemIndex);
    } else {
      newOpenItems.add(itemIndex);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "Ordering & Payment",
      icon: <CreditCard size={24} color="#000" />,
      items: [
        {
          question: "How do I place an order?",
          answer: "Simply browse our collection, select your preferred items and sizes, add them to your cart, and proceed to checkout. We accept all major credit cards, PayPal, and other secure payment methods."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with 256-bit SSL encryption."
        },
        {
          question: "Can I modify or cancel my order after placing it?",
          answer: "Orders can be modified or cancelled within 2 hours of placement. After this window, orders enter our fulfillment process and cannot be changed. Please contact our customer service immediately if you need assistance."
        },
        {
          question: "Do you offer payment plans or financing?",
          answer: "Yes! We partner with leading financing providers to offer flexible payment options. You can split your purchase into 4 interest-free installments or choose extended payment plans at checkout."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: <Truck size={24} color="#000" />,
      items: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-7 business days within Nigeria, 7-14 days internationally. Express shipping (1-3 days) and overnight delivery options are also available at checkout."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes! We ship worldwide to over 100 countries. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply depending on your country's regulations."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package in real-time through our website or the courier's tracking portal."
        },
        {
          question: "What if my package is lost or damaged?",
          answer: "We take full responsibility for lost or damaged packages. Contact us immediately with your order number, and we'll either resend your items or provide a full refund within 24 hours."
        }
      ]
    },
    {
      title: "Sizing & Fit",
      icon: <Shirt size={24} color="#000" />,
      items: [
        {
          question: "How do I find my perfect size?",
          answer: "Use our detailed size guide available on each product page. We provide measurements in both centimeters and inches. For the best fit, measure yourself and compare with our size charts rather than relying on your usual size from other brands."
        },
        {
          question: "What if the item doesn't fit?",
          answer: "No worries! We offer free size exchanges within 30 days. The item must be unworn, unwashed, and have all original tags attached. We'll cover the return shipping cost for size exchanges."
        },
        {
          question: "Are your sizes true to standard sizing?",
          answer: "Our sizes are designed to fit true to size, but we recommend checking our specific size guide as fits can vary between different styles and collections. When in doubt, size up for a more relaxed fit."
        },
        {
          question: "Do you offer custom sizing or alterations?",
          answer: "Currently, we don't offer custom sizing, but we're working on expanding this service. Our standard sizes are designed to accommodate a wide range of body types with comfortable, stylish fits."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      icon: <RefreshCw size={24} color="#000" />,
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Returns are free for defective items; other returns may incur a small processing fee."
        },
        {
          question: "How do I return an item?",
          answer: "Visit our returns portal on the website, enter your order number, select the items you want to return, and print the prepaid return label. Drop off the package at any authorized courier location."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive your returned items. The refund will appear on your original payment method within 5-10 business days, depending on your bank."
        },
        {
          question: "Can I exchange for a different item?",
          answer: "Direct item exchanges aren't available, but you can return your item for a refund and place a new order for the item you prefer. This ensures you get exactly what you want without delays."
        }
      ]
    },
    {
      title: "Product Care",
      icon: <Package size={24} color="#000" />,
      items: [
        {
          question: "How should I care for my Blacksfit clothing?",
          answer: "Each item comes with specific care instructions on the label. Generally, we recommend washing in cold water, turning items inside out, and air drying to maintain quality and color. Avoid bleach and high heat."
        },
        {
          question: "Are your products pre-shrunk?",
          answer: "Yes, all our cotton and cotton-blend items are pre-shrunk during manufacturing. However, we still recommend following care instructions carefully to maintain the perfect fit and appearance."
        },
        {
          question: "What materials do you use?",
          answer: "We use premium quality materials including 100% cotton, cotton blends, polyester, and sustainable fabrics. Each product page lists the exact material composition and care requirements."
        },
        {
          question: "How do I remove stains from my Blacksfit items?",
          answer: "For best results, treat stains immediately with cold water. For tougher stains, use a gentle stain remover before washing. Avoid harsh chemicals that might damage the fabric or fade the colors."
        }
      ]
    },
    {
      title: "About Blacksfit",
      icon: <Users size={24} color="#000" />,
      items: [
        {
          question: "What makes Blacksfit different?",
          answer: "Blacksfit represents more than just clothing—we embody the relentless African spirit. Our designs celebrate Black excellence, Nigerian pride, and the hustle mentality. Every piece is crafted for those who never stop grinding."
        },
        {
          question: "Do you have physical stores?",
          answer: "Currently, we operate primarily online to serve customers worldwide. However, we do have pop-up events and collaborations in major Nigerian cities. Follow our social media for announcements about physical locations and events."
        },
        {
          question: "How can I stay updated on new releases?",
          answer: "Subscribe to our newsletter, follow us on social media (@blacksfit), and enable push notifications on our website. VIP members get early access to new collections and exclusive discounts."
        },
        {
          question: "Do you collaborate with influencers or offer sponsorships?",
          answer: "Yes! We're always looking to partner with individuals who embody the Blacksfit spirit. Email partnerships@blacksfit.com with your proposal, social media stats, and why you align with our brand values."
        }
      ]
    }
  ];

  const AnimatedChevron = ({ isOpen }: { isOpen: boolean }) => {
    const rotateAnim = React.useRef(new Animated.Value(isOpen ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, [isOpen]);

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <Animated.View style={{ transform: [{ rotate }] }}>
        <ChevronDown size={20} color="#fff" />
      </Animated.View>
    );
  };

  const FAQItem = ({ item, globalIndex, isOpen }: { item: any; globalIndex: any; isOpen: boolean }) => {
    const heightAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(heightAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }, [isOpen]);

    const heightInterpolate = heightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150], // Adjust based on content height
    });

    return (
      <View style={styles.faqItem}>
        <TouchableOpacity
          style={[styles.questionButton, isOpen && styles.questionButtonOpen]}
          onPress={() => toggleItem(globalIndex)}
          activeOpacity={0.7}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <AnimatedChevron isOpen={isOpen} />
        </TouchableOpacity>
        
        <Animated.View style={[styles.answerContainer, { height: heightInterpolate }]}>
          <ScrollView>
            <Text style={styles.answerText}>{item.answer}</Text>
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>FAQ</Text>
        <Text style={styles.heroSubtitle}>
          Everything you need to know about{' '}
          <Text style={styles.heroBold}>Blacksfit</Text>
        </Text>
        <View style={styles.heroDivider} />
      </View>

      {/* FAQ Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {faqCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryCard}>
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={styles.iconContainer}>
                {category.icon}
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>

            {/* FAQ Items */}
            <View style={styles.faqItemsContainer}>
              {category.items.map((item, itemIndex) => {
                const globalIndex = `${categoryIndex}-${itemIndex}`;
                const isOpen = openItems.has(globalIndex);
                
                return (
                  <FAQItem
                    key={itemIndex}
                    item={item}
                    globalIndex={globalIndex}
                    isOpen={isOpen}
                  />
                );
              })}
            </View>
          </View>
        ))}

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <Text style={styles.contactText}>
            Can't find what you're looking for? Our customer service team is here to help. 
            We respond to all inquiries within 24 hours.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Message */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            #No sleep, just grind. - <Text style={styles.footerBold}>Blacksfit</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heroSection: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  heroBold: {
    fontWeight: 'bold',
  },
  heroDivider: {
    width: 96,
    height: 2,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  categoryCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 999,
    marginRight: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  faqItemsContainer: {
    gap: 8,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  questionButtonOpen: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 16,
  },
  answerContainer: {
    overflow: 'hidden',
  },
  answerText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    padding: 16,
    paddingTop: 8,
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    marginTop: 32,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    minWidth: 140,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    minWidth: 140,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footerBold: {
    fontWeight: 'bold',
  },
});

export default BlacksfitFAQ;