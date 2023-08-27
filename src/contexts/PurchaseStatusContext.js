import React, { createContext, useState, useEffect, useContext } from 'react';
import Purchases from 'react-native-purchases';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const PurchaseStatusContext = createContext();

export const PurchaseStatusProvider = ({ children }) => {
    const [purchasedWordPacks, setPurchasedWordPacks] = useState([]);
    const [entitlements, setEntitlements] = useState([]);

    const checkPurchasedItems = async (activeEntitlements) => {
        console.log("checkPurchasedItems called");
        try {
            //const storedWordPacks = await AsyncStorage.getItem('purchasedWordPacks');
            if (activeEntitlements) {
                setPurchasedWordPacks(activeEntitlements);
                return;
            } else {
                setPurchasedWordPacks(["free"]);
            }
        } catch (err) {
            console.error(err);
            setPurchasedWordPacks(["free"]);
        }
    };

    const refreshEntitlements = async () => {
        console.log("refreshEntitlements");
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const activeEntitlements = Object.entries(customerInfo.entitlements.active).map(entitlement => entitlement[0]);
            //console.log('Active entitlements: ' + activeEntitlements);
            setEntitlements(activeEntitlements);
            if (activeEntitlements.length > 0) {
                checkPurchasedItems(activeEntitlements);
            } else {
                checkPurchasedItems();
            }
        } catch (error) {
            console.log('Error refreshing entitlements:', error);
        }
    };

    useEffect(() => {
        refreshEntitlements();
    }, []);

    return (
        <PurchaseStatusContext.Provider value={{ purchasedWordPacks, refreshEntitlements }}>
            {children}
        </PurchaseStatusContext.Provider>
    );
};

export const usePurchaseStatus = () => {
    return useContext(PurchaseStatusContext);
};
