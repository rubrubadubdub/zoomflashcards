import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const dbVersion = "1.0.0";

export const useFetch = (selectedMenu) => {
  const [cards, setCards] = useState([]);
  const [dbWords, setDbWords] = useState(null);

  const executeSqlAsync = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  useEffect(() => {
    const db = SQLite.openDatabase(
      {
        name: "WordBank.db",
        location: "../databases",
        createFromLocation: 1,
      },
      () => {
        console.log("DB Loading Success");
        setDbWords(db);
        console.log(db);
      },
      () => console.log("Reading Database")
    );

    //checking version; confirming all dev builds are currently conforming to newest version.
    db.transaction((tx) => {
      tx.executeSql("PRAGMA user_version = ?", [dbVersion], () => {
        console.log("Database version changed to", dbVersion);
      });
    });

    return () => {
      dbWords && dbWords.close();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!dbWords) {
        return;
      }

      console.log("Selected Menu: ", selectedMenu);
      try {
        const results = await executeSqlAsync(
          dbWords,
          "SELECT id, menu, menuOrder, menuItem, action, imagePath FROM menuList WHERE menu = ? ORDER BY menuOrder",
          [selectedMenu]
        );
        console.log("Rows returned:", results);
        const cards = results.map((row) => ({
          id: row.id,
          title: row.menuItem,
          image: { uri: row.imagePath }, // assuming the image path is a URL or file path
          action: row.action,
        }));
        setCards(cards);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [selectedMenu, dbWords]);

  return cards;
};