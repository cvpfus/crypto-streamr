"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosConfig, Aptos, Network } from "@aptos-labs/ts-sdk";
import { formSchema, type TipFormData } from "@/lib/definitions";
import { triggerNotification } from "@/lib/actions";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export default function TipForm({
  username,
  address,
}: {
  username: string;
  address: string;
}) {
  const { account, signAndSubmitTransaction } = useWallet();

  const form = useForm<TipFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0.001,
      message: "",
      anonymous: false,
    },
  });

  const onSubmit = async (formData: TipFormData) => {
    try {
      if (!address) {
        toast({
          title: "Error",
          description: "Send tip failed. Recipient address not found.",
          variant: "destructive",
        });

        return;
      }

      if (!account) {
        toast({
          title: "Error",
          description:
            "Send tip failed. Make sure you are connected to a wallet.",
          variant: "destructive",
        });

        return;
      }

      if (address === account.address) {
        toast({
          title: "Error",
          description: "You cannot tip yourself",
          variant: "destructive",
        });

        return;
      }

      const tx = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [address, formData.amount * 100000000],
        },
      });

      const { success } = await aptos.waitForTransaction({
        transactionHash: tx.hash,
      });

      if (success) {
        await triggerNotification({ formData, username });
      } else {
        toast({
          title: "Error",
          description: "Send tip failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full"
      >
        <div className="flex flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name"
                    autoComplete="off"
                    {...field}
                    disabled={form.watch("anonymous")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 mr-auto -mt-2">
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="anonymous"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="anonymous" className="font-normal">
                    Anonymous
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Amount"
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Message" maxLength={255} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-8">
          Send Tip
        </Button>
      </form>
    </Form>
  );
}
