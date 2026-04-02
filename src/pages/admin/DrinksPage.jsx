import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  addDoc
} from "firebase/firestore";

export default function DrinksPage() {
    const [drinks, setDrinks] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        base_prep_time: 30
    });

    // 🔥 REAL-TIME DRINKS
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "drinks"),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
                }));
                setDrinks(data);
            }
        );

        return () => unsubscribe();
    }, []);

    // 🔥 CREATE DRINK
    const createDrink = async () => {
        await addDoc(collection(db, "drinks"), {
            ...form,
            base_prep_time: form.base_prep_time * 1000,
            ingredients: [],
            steps: [],
            is_active: true,
            created_at: Date.now()
        });

        setForm({
            name: "",
            description: "",
            category: "",
            base_prep_time: 30
        });
    };

    return (
        <div>
            <h1 className="page-title">Drink Database</h1>

            {/* CREATE */}
            <div className="card">
                <h3>Add Drink</h3>

                <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <input
                placeholder="Category (cocktail, beer...)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <input
                type="number"
                placeholder="Prep Time (seconds)"
                value={form.base_prep_time}
                onChange={(e) =>
                    setForm({ ...form, base_prep_time: Number(e.target.value) })
                }
                />

                <button className="btn-primary" onClick={createDrink}>
                Add Drink
                </button>
            </div>

            {/* LIST */}
            <div className="event-grid">
                {drinks.map(drink => (
                <div key={drink.id} className="card">
                    <h3>{drink.name}</h3>
                    <p className="text-secondary">{drink.category}</p>
                    <p className="text-muted">{drink.description}</p>
                    <p>⏱ {Math.floor(drink.base_prep_time / 1000)}s</p>
                </div>
                ))}
            </div>
        </div>
    );
}