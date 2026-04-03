# Fullstack Mini Library Manager

### Tech Stack

*   **Frontend**: ReactJS + ShadCN UI
*   **Backend**: NodeJS + Express
*   **Database**: MongoDB (Mongoose)
*   **Design**: Stitch Design

---

## Database Schema (Table Format)

### 1. Authors

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| _id | ObjectId | ✅ | ID của author |
| name | String | ✅ | Tên tác giả |
| bio | String | ❌ | Mô tả ngắn |
| birthDate | Date | ❌ | Ngày sinh |
| createdAt | Date | ✅ | Thời điểm tạo |
| updatedAt | Date | ✅ | Thời điểm cập nhật |

---

### 2. Books

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| _id | ObjectId | ✅ | ID của book |
| title | String | ✅ | Tên sách |
| authorId | ObjectId (ref Authors) | ✅ | Liên kết tác giả |
| totalStock | Number | ✅ | Tổng số sách |
| availableStock | Number | ✅ | Số sách còn có thể mượn |
| publishedYear | Number | ❌ | Năm xuất bản |
| createdAt | Date | ✅ | Thời điểm tạo |
| updatedAt | Date | ✅ | Thời điểm cập nhật |

---

### 3. Borrowings

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| _id | ObjectId | ✅ | ID borrowing |
| bookId | ObjectId (ref Books) | ✅ | Sách được mượn |
| borrowerName | String | ✅ | Người mượn |
| borrowDate | Date | ✅ | Ngày mượn |
| returnDate | Date | ❌ | Ngày trả |
| status | Enum (BORROWED / RETURNED) | ✅ | Trạng thái |
| createdAt | Date | ✅ | Thời điểm tạo |
| updatedAt | Date | ✅ | Thời điểm cập nhật |

---

## API Endpoints

### Authors

| Method | URL | Mô tả |
| :--- | :--- | :--- |
| GET | /api/authors | Lấy danh sách authors |
| POST | /api/authors | Tạo author |
| GET | /api/authors/:id | Chi tiết author |
| PUT | /api/authors/:id | Update author |
| DELETE | /api/authors/:id | Xóa author |

---

### Books

| Method | URL | Mô tả |
| :--- | :--- | :--- |
| GET | /api/books | Lấy danh sách books |
| POST | /api/books | Tạo book |
| GET | /api/books/:id | Chi tiết book |
| PUT | /api/books/:id | Update book |
| DELETE | /api/books/:id | Xóa book |

---

### Borrowings

| Method | URL | Mô tả |
| :--- | :--- | :--- |
| GET | /api/borrowings | Lấy danh sách borrow |
| POST | /api/borrowings | Tạo record mượn sách |
| PUT | /api/borrowings/:id/return | Trả sách |
| GET | /api/borrowings/:id | Chi tiết borrowing |

---

### Stats

| Method | URL | Mô tả |
| :--- | :--- | :--- |
| GET | /api/stats/overview | Tổng số sách, authors, borrow |
| GET | /api/stats/top-books | Top sách được mượn nhiều |
| GET | /api/stats/borrow-status | Số lượng đang mượn vs đã trả |

---

## Business Rules (BẮT BUỘC)

1. **Không cho mượn khi hết sách**
    *   `availableStock === 0` -> reject
2. **Mỗi lần mượn -> giảm availableStock**
    *   Borrow -> `availableStock - 1`
3. **Trả sách -> tăng lại availableStock**
    *   Return -> `availableStock + 1`
4. **Không cho xóa Author nếu có Book**
    *   Check foreign key (authorid)
5. **Không cho xóa Book nếu đang có Borrowing chưa trả**
    *   Nếu tồn tại `status = BORROWED` -> reject delete
