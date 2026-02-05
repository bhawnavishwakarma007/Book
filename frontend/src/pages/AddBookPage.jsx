import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { createBook } from "@/services/book.service";

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    bookname: "",
    authorname: "",
    price: "",
    qty: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBook({
        ...formData,
        price: Number(formData.price),
        qty: Number(formData.qty),
      });

      toast.success("Book added successfully!");
      setFormData({
        bookname: "",
        authorname: "",
        price: "",
        qty: "",
        description: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="bookname" placeholder="Book Name" value={formData.bookname} onChange={handleChange} />
            <Input name="authorname" placeholder="Author Name" value={formData.authorname} onChange={handleChange} />
            <Input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
            <Input name="qty" type="number" placeholder="Quantity" value={formData.qty} onChange={handleChange} />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />

            <Button type="submit" className="w-full">
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBookPage;
