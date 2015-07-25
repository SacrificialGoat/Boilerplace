package main_test

import (
	. "app/server"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Server", func() {
	Describe("Server Test #1", func() {
	      Context("Checking 10 ....", func() {
	          It("should be 100", func() {
	              
	              result := TestSuite()

	              Expect(result).To(Equal(11))
	          })

	          It("should be 20", func() {
	              
	              result := TestSuite2()

	              Expect(result).To(Equal(20))
	          })
	      })

	  })

})
