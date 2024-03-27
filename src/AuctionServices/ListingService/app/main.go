package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"

	"github.com/jackc/pgx/v5"
	"google.golang.org/grpc"

	pb "github.com/bognar-dev/listingservice/protogen" // replace with the path to your generated protobuf go file
)

var conn *pgx.Conn

type server struct {
	pb.UnimplementedListingServiceServer
}

func (s *server) AddLot(ctx context.Context, in *pb.Lot) (*pb.Lot, error) {
	var err error

	conn, err = pgx.Connect(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}
	defer conn.Close(ctx)

	_, err = conn.Exec(context.Background(), "insert into lot(name) values($1)", &in.Name)
	if err != nil {
		return nil, fmt.Errorf("QueryRow failed: %v", err)
	}

	// Here you should map the result of your query to the Lot message
	// For now, let's return an empty Lot
	return &pb.Lot{}, nil
}

func main() {
	lis, err := net.Listen("tcp", "localhost:50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterListingServiceServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
	log.Println("Server started on port 50051")
}
