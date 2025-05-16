
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Calculator, TrendingUp, ArrowRight, Info } from "lucide-react"
import { AdjustedROIForm } from "./adjusted-roi-form"
import React, { use, useEffect, useState } from "react"
import { SetSearchDropdown } from "./search-dropmenu"
import { Button } from "../../components/ui/button"
import { calculateROI } from "./adjustedRoiCalculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PackBreakdown } from "./packbreakdown"

const queryClient = new QueryClient();

export function ROICalculator(
    { sets }: { sets: any }
) {
    // Purchase details
    const [purchasePrice, setPurchasePrice] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // Selling details
    const [estimatedValue, setEstimatedValue] = useState(150)
    const [sellingFees, setSellingFees] = useState(10)
    const [shippingCost, setShippingCost] = useState(5)
    const [timeframe, setTimeframe] = useState(12)

    // Variables
    const [selectedSet, setSelectedSet] = useState<string>("Prismatic Evolutions")
    const [loading, setLoading] = useState(false)

    // Adjusted ROI variables
    const [riskTolerance, setRiskTolerance] = useState(5)
    const [emotionalAttachment, setEmotionalAttachment] = useState(5)
    const [spending, setSpending] = useState(5)

    // ROI
    const [ROI, setROI] = useState<number | null>(0)
    const [adjustedROI, setAdjustedROI] = useState<number | null>(0)
    const [acceptableLoss, setAcceptableLoss] = useState<number | null>(0)

    // Calculations
    const totalInvestment = purchasePrice * quantity
    const totalReturn = ROI == null ? 0 : ROI * quantity
    const profit = totalReturn - totalInvestment
    const totalAdjustedReturns = adjustedROI == null ? 0 : adjustedROI * quantity
    const percentageROI = totalReturn === 0 ? "0" : (((totalReturn - totalInvestment) / totalInvestment) * 100).toFixed(2)
    const percentageAdjustedROI = totalAdjustedReturns === 0 ? "0" : (((totalAdjustedReturns - totalInvestment)/totalInvestment) * 100).toFixed(2)

    useEffect(() => {
        console.log("change found")
        if (selectedSet) {
            const set = sets.find((s: any) => s.set === selectedSet)
            if (set) {
                console.log(set)
                setPurchasePrice(set.packPrice)
                setROI(set.expectedValue)
            }
        }
    }, [selectedSet])

    const handleROICalc = async () => {
        setLoading(true)
        const data = calculateROI(ROI, purchasePrice, riskTolerance, emotionalAttachment, spending)
        console.log(data)
        const adjustedROI = data[0]
        const acceptableLoss = data[1]
        setAdjustedROI(adjustedROI)
        setAcceptableLoss(acceptableLoss)
        setLoading(false)
    }



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" /> Purchase Details
                    </CardTitle>
                    <CardDescription>Enter the details of your card purchase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="quantity">Set</Label>
                    
                    <SetSearchDropdown onSelect={(set: string) => setSelectedSet(set)} sets={sets} />


                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="fees">Pack Cost ($)</Label>
                    <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number.parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="shipping">Quantity of packs</Label>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(Number.parseFloat(e.target.value) || 0)} />
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Adjust ROI Inputs
                    </CardTitle>
                    <CardDescription>Enter the details about risk tolerance and emotional attachment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AdjustedROIForm risk={riskTolerance} onRisk={setRiskTolerance} emotion={emotionalAttachment} onEmotion={setEmotionalAttachment} spend={spending} onSpend={setSpending}/>
                    <Button onClick={handleROICalc} disabled={loading}>
                        {loading ? "Calculating..." : "Get Adjusted ROI"}
                    </Button>
                </CardContent >
            </Card>
        </div>

        <div className="space-y-6">
            
        <Card className="sticky top-8">
            <Tabs defaultValue="Results" className="w-full">
                <TabsList className="flex space-x-2 border-b border-gray-300 mb-6">
                <TabsTrigger
                    value="Results"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none 
                            data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                    Results
                </TabsTrigger>
                <TabsTrigger
                    value="Pack value breakdown"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none 
                            data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                    Pack Breakdown
                </TabsTrigger>
                </TabsList>

                <TabsContent value="Results">
                <CardHeader>
                    <CardTitle>ROI Results</CardTitle>
                    <CardDescription>Your projected return on investment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">Total Investment</p>
                        <p className="text-2xl font-bold">${totalInvestment.toFixed(2)}</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">Total Return</p>
                        <p className="text-2xl font-bold">${totalReturn.toFixed(2)}</p>
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-muted-foreground text-sm">Profit/Loss</p>
                        <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${profit.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-muted-foreground text-sm">ROI</p>
                        <p className={`text-2xl font-bold ${percentageROI === null ? 0 : parseFloat(percentageROI) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {percentageROI}%
                        </p>
                    </div>
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle>Adjusted ROI</CardTitle>
                    <CardDescription>Tweaking ROI based on your inputs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">Total Investment</p>
                        <p className="text-2xl font-bold">${totalInvestment.toFixed(2)}</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">Total Return</p>
                        <p className="text-2xl font-bold">${totalAdjustedReturns.toFixed(2)}</p>
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-muted-foreground text-sm">Adjusted ROI</p>
                        <p className={`text-2xl font-bold ${parseFloat(percentageAdjustedROI) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {percentageAdjustedROI}%
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-muted-foreground text-sm">Recommended Acceptable Loss</p>
                        <p className={`text-2xl font-bold ${acceptableLoss === null ? 0 : acceptableLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${acceptableLoss === null ? 0 : Math.abs(acceptableLoss)}
                        </p>
                    </div>
                    </div>
                </CardContent>
                </TabsContent>

                <TabsContent value="Pack value breakdown">
                <CardHeader>
                    <CardTitle>Pack Value Breakdown</CardTitle>
                    <CardDescription>Breakdown of the value of your pack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <QueryClientProvider client={queryClient}>
                        <PackBreakdown set_name={selectedSet}/>
                    </QueryClientProvider>
                </CardContent>
                </TabsContent>
            </Tabs>
            </Card>
        </div>
    </div>
  );
}