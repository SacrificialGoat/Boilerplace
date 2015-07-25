package main_test

import (
	. "github.com/app/server"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	// "net/http"
	// "net/http/httptest"
)

var _ = Describe("Server", func() {
	Describe("Testing SEssion", func() {
		It("should be working", func() {
			// recorder := httptest.NewRecorder()
			// request, _ := http.NewRequest("GET", "/api/test", nil)
			// ctx := context.New()
			// result := CheckSession()
			result := Testing1()
			Expect(result).To(Equal(11))
			Expect(200).To(Equal(200))

		})


	})



})
