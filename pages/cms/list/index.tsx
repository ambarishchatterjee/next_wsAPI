import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CardActions,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import toast from "react-hot-toast";
import SweetAlertComponent from "@/ui/sweetalert";
import {
  allProductsQuery,
  deleteMutation,
} from "@/customHooks/query/cms.query.createhooks";
import ProductDetailsModal from "../productdetails/productdetails";
import { productt, profile_pic } from "@/api/axios/axios";
import Link from "next/link";

export default function List() {
  const [page, setPage] = useState(1);
  const [isTableView, setIsTableView] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<
    string | number | null
  >(null);
  const [modal, setModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  //console.log(page, "page");
  const perPage = 10;

  const {
    data: list,
    isPending,
    isError,
    error,
  } = allProductsQuery(page, perPage);

  const totalPages = list?.data.totalPages || 1;
//  console.log(perPage, "perPage");
  const products = list?.data.data || [];

  const { mutate, isPending: isDeleting } = deleteMutation();

  const toggleView = () => setIsTableView((prev) => !prev);

  const handleDelete = () => {
    if (!deleteId) return;

    const formData = new FormData();
    formData.append("id", deleteId);

    mutate(formData, {
      onSuccess: () => {
        toast.success("Product deleted successfully!");
        setModal(false);
        setDeleteId(null);
      },
      onError: () => {
        toast.error("Failed to delete the product.");
      },
    });
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleOpenModal = (id: string | number) => {
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  const renderTableRow = (product: any) => (
    <TableRow key={product._id} sx={{background: "#999"}}
>
      <TableCell>
        <img
          src={productt(product.image) || "https://placehold.co/600x400"}
          alt={product.title}
          style={{ height: "100px", objectFit: "cover" }}
        />
      </TableCell>
      <TableCell>{product.title}</TableCell>
      <TableCell>{product.description}</TableCell>
      <TableCell align="center">
        <Button
          sx={{ background: "#222" }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(product._id)}
        >
          View
        </Button>
        <IconButton
          color="error"
          onClick={() => {
            setDeleteId(product._id);
            setModal(true);
          }}
        >
          <DeleteIcon />
        </IconButton>
        <Link 
          href={`/cms/list/${product._id}`} >
          Edit
        </Link>
      </TableCell>
    </TableRow>

  );
  

  const renderCard = (product: any) => (
    <Grid item xs={12} sm={6} md={4} key={product._id}>
      <Card
        sx={{
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": { transform: "scale(1.05)", boxShadow: 8 }, background: "#999"
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={productt(product.image) || "/placeholder.jpg"}
          alt={product.title}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" align="center">
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {product.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            sx={{
              padding: 1,
              border: "1px solid #ccc",
              borderRadius: "8px",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{background: "#222"}}
              onClick={() => handleOpenModal(product._id)}
            >
              View Details
            </Button>
            <IconButton
              color="error"
              onClick={() => {
                setDeleteId(product._id);
                setModal(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <Link style={{background:"#222", color: "#fff", padding: "14px 28px"}}
 href={`/cms/list/${product._id}`} >
              Edit
            </Link>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "50px auto 0",
        padding: "50px 16px",
        background: "#222"
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", marginBottom: 4, color: "#fff" }}
      >
        Product List
      </Typography>

      <FormControlLabel sx={{color: "#fff", marginBottom: "20px", background: "#999", width: "100%"}}
        control={<Switch checked={isTableView} onChange={toggleView} />}
        label="Toggle Table View"
      />

      {isPending ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : isError ? (
        <Typography align="center" color="error">
          Failed to load products. Please try again later.
        </Typography>
      ) : products.length === 0 ? (
        <Typography align="center">No products found.</Typography>
      ) : isTableView ? (
        <TableContainer component={Paper} sx={{ borderRadius: "0px" }}>
          <Table>
            <TableHead sx={{ background: "#fff" }}>
              <TableRow >
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{products.map(renderTableRow)}</TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={4}>
          {products.map(renderCard)}
        </Grid>
      )}

      {modal && (
        <SweetAlertComponent
          confirm={handleDelete}
          cancle={() => setModal(false)}
          title="Are You Sure?"
          subtitle="You will not be able to recover this product"
          type="warning"
        />
      )}

      {selectedProductId !== null && (
        <ProductDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          id={selectedProductId}
        />
      )}

      {products && (
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          <Typography>
            Page {page} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            disabled={page === totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
