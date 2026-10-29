
import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

const emptyForm = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: ""
};

function money(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

export default function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  async function loadFoods(keyword = "") {
    setLoading(true);

    try {
      const query = keyword.trim()
        ? `?search=${encodeURIComponent(keyword.trim())}`
        : "";

      const data = await api(`/api/foods${query}`);
      setFoods(data);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
    setShowForm(true);
  }

  function openEdit(food) {
    setEditingId(food.foodId);
    setForm({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine,
      ingredients: food.ingredients.join(", "),
      price: String(food.price),
      quantity: String(food.quantity),
      description: food.description,
      imageUrl: food.imageUrl || ""
    });
    setFormError("");
    setSelected(null);
    setShowForm(true);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function saveFood(event) {
    event.preventDefault();
    setFormError("");

    const food = {
      foodId: form.foodId.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      ingredients: form.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim()
    };

    if (
      !food.foodId ||
      !food.name ||
      !food.category ||
      !food.cuisine ||
      !food.description ||
      food.ingredients.length === 0 ||
      form.price.trim() === "" ||
      form.quantity.trim() === "" ||
      !Number.isFinite(food.price) ||
      food.price < 0 ||
      !Number.isInteger(food.quantity) ||
      food.quantity < 0
    ) {
      setFormError("Vui lòng nhập đầy đủ dữ liệu hợp lệ.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await api(`/api/foods/${encodeURIComponent(editingId)}`, {
          method: "PUT",
          body: JSON.stringify(food)
        });
      } else {
        await api("/api/foods", {
          method: "POST",
          body: JSON.stringify(food)
        });
      }

      setShowForm(false);
      await loadFoods(search);
      setNotice({
        type: "success",
        text: editingId
          ? "Cập nhật món ăn thành công!"
          : "Thêm món ăn thành công!"
      });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteFood(food) {
    if (!window.confirm(`Bạn muốn xóa "${food.name}"?`)) {
      return;
    }

    try {
      await api(
        `/api/foods/${encodeURIComponent(food.foodId)}`,
        { method: "DELETE" }
      );

      setSelected(null);
      await loadFoods(search);
      setNotice({
        type: "success",
        text: `Đã xóa món ăn ${food.name}.`
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  async function showDetail(food) {
    try {
      const data = await api(
        `/api/foods/${encodeURIComponent(food.foodId)}`
      );
      setSelected(data);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    loadFoods(search);
  }

  function resetSearch() {
    setSearch("");
    loadFoods("");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">🍜</div>
          <div>
            <strong>Food Manager</strong>
            <small>Hệ thống quản lý món ăn</small>
          </div>
        </div>
        <span className="student">MSSV: 236729</span>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">ĐIỆN TOÁN ĐÁM MÂY</p>
            <h1>Quản lý món ăn</h1>
            <p>
              Quản lý thực đơn, giá bán và số lượng món ăn
              trên nền tảng MongoDB Atlas.
            </p>
          </div>
          <button className="btn primary" onClick={openCreate}>
            + Thêm món ăn
          </button>
        </section>

        {notice && (
          <div className={`notice ${notice.type}`} role="alert">
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)}>✕</button>
          </div>
        )}

        <section className="toolbar">
          <form className="search" onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tên, loại, vùng miền..."
            />
            <button className="btn primary" type="submit">
              Tìm kiếm
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={resetSearch}
            >
              Tất cả
            </button>
          </form>
          <div className="count">
            {foods.length} món ăn
          </div>
        </section>

        {loading ? (
          <div className="empty">Đang tải dữ liệu món ăn...</div>
        ) : foods.length === 0 ? (
          <div className="empty">
            Không tìm thấy món ăn phù hợp.
          </div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <article className="food-card" key={food.foodId}>
                <div className="food-image">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>🍽️</span>
                  )}
                </div>

                <div className="food-info">
                  <span className="tag">{food.category}</span>
                  <h3>{food.name}</h3>
                  <p className="cuisine">📍 {food.cuisine}</p>
                  <p className="description">
                    {food.description}
                  </p>

                  <div className="food-meta">
                    <strong>{money(food.price)}</strong>
                    <span>Còn {food.quantity} phần</span>
                  </div>

                  <div className="actions">
                    <button
                      className="btn secondary"
                      onClick={() => showDetail(food)}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => openEdit(food)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => deleteFood(food)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer>
        Cloud Computing Project · 236729 · TranHoangKhiem
      </footer>

      {selected && (
        <div
          className="overlay"
          onClick={() => setSelected(null)}
        >
          <section
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Chi tiết món ăn</h2>
              <button
                className="close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            <h3>{selected.name}</h3>
            <p><b>Mã món:</b> {selected.foodId}</p>
            <p><b>Loại:</b> {selected.category}</p>
            <p><b>Vùng miền:</b> {selected.cuisine}</p>
            <p><b>Nguyên liệu:</b> {selected.ingredients.join(", ")}</p>
            <p><b>Giá:</b> {money(selected.price)}</p>
            <p><b>Số lượng:</b> {selected.quantity}</p>
            <p><b>Mô tả:</b> {selected.description}</p>

            <button
              className="btn primary full"
              onClick={() => openEdit(selected)}
            >
              Chỉnh sửa món ăn
            </button>
          </section>
        </div>
      )}

      {showForm && (
        <div
          className="overlay"
          onClick={() => !saving && setShowForm(false)}
        >
          <section
            className="modal form-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>
                {editingId ? "Cập nhật món ăn" : "Thêm món ăn"}
              </h2>
              <button
                className="close"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="notice error">{formError}</div>
            )}

            <form onSubmit={saveFood} className="food-form">
              <div className="form-grid">
                <label>
                  Mã món ăn
                  <input
                    name="foodId"
                    value={form.foodId}
                    onChange={updateField}
                    disabled={!!editingId}
                    required
                  />
                </label>

                <label>
                  Tên món ăn
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Loại món ăn
                  <input
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Vùng miền
                  <input
                    name="cuisine"
                    value={form.cuisine}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Giá bán (VNĐ)
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={updateField}
                    min="0"
                    required
                  />
                </label>

                <label>
                  Số lượng
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={updateField}
                    min="0"
                    step="1"
                    required
                  />
                </label>
              </div>

              <label>
                Nguyên liệu (ngăn cách bằng dấu phẩy)
                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={updateField}
                  placeholder="Thịt bò, bánh phở, hành..."
                  required
                />
              </label>

              <label>
                Mô tả
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows="3"
                  required
                />
              </label>

              <label>
                URL hình ảnh (không bắt buộc)
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={updateField}
                  placeholder="https://..."
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu món ăn"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
